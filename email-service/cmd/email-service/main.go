package main

import (
	"email-service/internal/config"
	"email-service/internal/email"
	"email-service/internal/email/sendgrid"
	"fmt"
	"log"
	"os"
)

func main() {
	// Load configuration
	config.LoadConfig()

	var emailSender email.Sender
	var senderInitErr error

	switch os.Getenv("DEV_ENV") {
	case "development":
		emailSender, senderInitErr = sendgrid.NewSendGridSender(config.AppConfig.SendGridAPIKey)
	default:
		senderInitErr = fmt.Errorf("unsupported environment: %s", os.Getenv("DEV_ENV"))
	}

	if senderInitErr != nil {
		log.Fatalf("Failed to initialize email sender: %v", senderInitErr)
	}

	if emailSender == nil {
		log.Fatal("Email sender is nil")
	}
}
