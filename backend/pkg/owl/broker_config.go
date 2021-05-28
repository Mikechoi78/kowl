package owl

import (
	"context"
	"fmt"
	"go.uber.org/zap"
	"net/http"

	"github.com/cloudhut/common/rest"
	"github.com/twmb/franz-go/pkg/kerr"
	"github.com/twmb/franz-go/pkg/kmsg"
)

type BrokerConfig struct {
	brokerID int32 `json:"-"`

	Configs []BrokerConfigEntry `json:"configs"`
	Error   string              `json:"error,omitempty"`
}

type BrokerConfigEntry struct {
	Name   string  `json:"name"`
	Value  *string `json:"value"` // If value is sensitive this will be nil
	Source string  `json:"source"`
	Type   string  `json:"type"`
	// IsExplicitlySet indicates whether this config's value was explicitly configured. It could still be the default value.
	IsExplicitlySet bool                  `json:"isExplicitlySet"`
	IsDefaultValue  bool                  `json:"isDefaultValue"`
	IsReadOnly      bool                  `json:"isReadOnly"`
	IsSensitive     bool                  `json:"isSensitive"`
	Documentation   *string               `json:"-"` // Will be nil for Kafka <v2.6.0
	Synonyms        []BrokerConfigSynonym `json:"synonyms"`
}

type BrokerConfigSynonym struct {
	Name   string  `json:"name"`
	Value  *string `json:"value"`
	Source string  `json:"source"`
}

func (s *Service) GetAllBrokerConfigs(ctx context.Context) (map[int32]BrokerConfig, error) {
	metadata, err := s.kafkaSvc.GetMetadata(ctx, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to get broker ids: %w", err)
	}

	// Send one broker config request for each broker concurrently
	resCh := make(chan BrokerConfig, len(metadata.Brokers))

	for _, broker := range metadata.Brokers {
		go func(bID int32) {
			cfg, restErr := s.GetBrokerConfig(ctx, bID)
			errMsg := ""
			if restErr != nil {
				s.logger.Warn("failed to describe broker config", zap.Int32("broker_id", bID), zap.Error(restErr.Err))
				errMsg = restErr.Err.Error()
			}
			resCh <- BrokerConfig{
				brokerID: bID,
				Configs:  cfg,
				Error:    errMsg,
			}
		}(broker.NodeID)
	}

	configsByBrokerID := make(map[int32]BrokerConfig)
	for i := 0; i < cap(resCh); i++ {
		res := <-resCh
		if res.Error != "" {
			res.Configs = nil
			continue
		}
		configsByBrokerID[res.brokerID] = res
	}

	return configsByBrokerID, nil
}

func (s *Service) GetBrokerConfig(ctx context.Context, brokerID int32) ([]BrokerConfigEntry, *rest.Error) {
	res, err := s.kafkaSvc.DescribeBrokerConfig(ctx, brokerID, nil)
	if err != nil {
		return nil, &rest.Error{
			Err:      fmt.Errorf("failed to request broker config: %w", err),
			Status:   http.StatusServiceUnavailable,
			Message:  fmt.Sprintf("Failed to request broker's config: %v", err.Error()),
			IsSilent: false,
		}
	}

	// Resources should always be of length = 1
	for _, resource := range res.Resources {
		err := kerr.TypedErrorForCode(resource.ErrorCode)
		if err != nil {
			return nil, &rest.Error{
				Err:      err,
				Status:   http.StatusServiceUnavailable,
				Message:  fmt.Sprintf("Failed to describe broker config resource: %v", err.Error()),
				IsSilent: false,
			}
		}

		configEntries := make([]BrokerConfigEntry, len(resource.Configs))
		for j, cfg := range resource.Configs {
			isDefaultValue := false
			innerEntries := make([]BrokerConfigSynonym, len(cfg.ConfigSynonyms))
			for j, innerCfg := range cfg.ConfigSynonyms {
				innerEntries[j] = BrokerConfigSynonym{
					Name:   innerCfg.Name,
					Value:  innerCfg.Value,
					Source: innerCfg.Source.String(),
				}
				if innerCfg.Source == kmsg.ConfigSourceDefaultConfig {
					isDefaultValue = derefString(cfg.Value) == derefString(innerCfg.Value)
				}
			}

			isExplicitlySet := false
			if cfg.Source == kmsg.ConfigSourceUnknown {
				// Kafka <v1.1 uses the IsDefault property. Since then it's been replaced by ConfigSource and defaults
				// to false. Thus we only consider it if cfg.Source is not set / unknown.
				isExplicitlySet = !cfg.IsDefault
			} else {
				isExplicitlySet = cfg.Source == kmsg.ConfigSourceStaticBrokerConfig || cfg.Source == kmsg.ConfigSourceDynamicBrokerConfig
			}
			configEntries[j] = BrokerConfigEntry{
				Name:            cfg.Name,
				Value:           cfg.Value,
				Source:          cfg.Source.String(),
				Type:            cfg.ConfigType.String(),
				IsExplicitlySet: isExplicitlySet,
				IsDefaultValue:  isDefaultValue,
				IsReadOnly:      cfg.ReadOnly,
				IsSensitive:     cfg.IsSensitive,
				Documentation:   cfg.Documentation,
				Synonyms:        innerEntries,
			}
		}

		return configEntries, nil
	}

	return nil, &rest.Error{
		Err:      fmt.Errorf("broker describe config response was empty"),
		Status:   http.StatusInternalServerError,
		Message:  "Broker config response was empty",
		IsSilent: false,
	}
}
