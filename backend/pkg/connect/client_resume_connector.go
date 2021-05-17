package connect

import (
	"context"
)

func (c *Client) ResumeConnector(ctx context.Context, connectorName string) error {
	response, err := c.client.NewRequest().
		SetContext(ctx).
		SetError(ApiError{}).
		SetPathParam("connector", connectorName).
		Put("/connectors/{connector}/resume")
	if err != nil {
		return err
	}

	err = getErrorFromResponse(response)
	if err != nil {
		return err
	}

	return nil
}
