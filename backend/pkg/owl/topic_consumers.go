package owl

import (
	"context"
	"fmt"
)

// TopicConsumersGroup is a group along with it's accumulated topic log for a given topic
type TopicConsumerGroup struct {
	GroupID   string `json:"groupId"`
	SummedLag int64  `json:"summedLag"`
}

// ListTopicConsumers returns all consumer group names along with their accumulated lag across all partitions which
// have at least one active offset on the given topic.
func (s *Service) ListTopicConsumers(ctx context.Context, topicName string) ([]*TopicConsumerGroup, error) {
	groups, err := s.kafkaSvc.ListConsumerGroups(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to list consumer groups: %w", err)
	}

	lags, err := s.getConsumerGroupLags(ctx, groups)
	if err != nil {
		return nil, fmt.Errorf("failed to get consumer group lags: %w", err)
	}

	response := make([]*TopicConsumerGroup, 0, len(lags))
	for _, lag := range lags {
		for _, topicLag := range lag.TopicLags {
			if topicLag.Topic != topicName {
				continue
			}

			cg := &TopicConsumerGroup{GroupID: lag.GroupID, SummedLag: topicLag.SummedLag}
			response = append(response, cg)
		}
	}

	return response, nil
}
