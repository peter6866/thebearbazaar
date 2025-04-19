package sendgrid

import (
	"context"
	"email-service/internal/email"
	"errors"
	"fmt"
	"net/http"

	"github.com/sendgrid/sendgrid-go"
	"github.com/sendgrid/sendgrid-go/helpers/mail"
)

type sendgridSender struct {
	client     *sendgrid.Client
	senderName string
}

var _ email.Sender = (*sendgridSender)(nil)

// NewSender creates a new SendGrid email sender.
func NewSendGridSender(apiKey string) (*sendgridSender, error) {
	if apiKey == "" {
		return nil, errors.New("API key is required")
	}
	client := sendgrid.NewSendClient(apiKey)
	return &sendgridSender{
		client:     client,
		senderName: "The Bear Bazaar",
	}, nil
}

func (s *sendgridSender) Send(ctx context.Context, from string, data email.EmailData) error {
	if data.To == "" || from == "" || data.Subject == "" || data.Body == "" {
		return fmt.Errorf("missing required fields for sending email (From, To, Subject, Body)")
	}

	// Create SendGrid mail helper object
	fromEmail := mail.NewEmail(s.senderName, from)
	toEmail := mail.NewEmail("", data.To)

	// Create message object
	message := mail.NewSingleEmail(fromEmail, data.Subject, toEmail, "", data.Body)

	// Send the email
	response, err := s.client.SendWithContext(ctx, message)
	if err != nil {
		return fmt.Errorf("failed to send email: %w", err)
	}

	if response.StatusCode < http.StatusOK || response.StatusCode >= http.StatusMultipleChoices {
		return fmt.Errorf("failed to send email, status code: %d, body: %s", response.StatusCode, response.Body)
	}

	return nil
}
