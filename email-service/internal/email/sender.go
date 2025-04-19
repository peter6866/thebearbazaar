package email

import "context"

// EmailData holds the necessary information for sending an email.
type EmailData struct {
	To      string
	Subject string
	Body    string
}

// Sender defines the interface for sending emails.
type Sender interface {
	// Send sends an email using the provider's specific implementation.
	// ctx can be used for cancellation or deadlines.
	// from is the configured sender email address (e.g., "noreply@example.com").
	// email contains the recipient, subject, and body details.
	Send(ctx context.Context, from string, email EmailData) error
}
