package config

import (
	"os"
)

type Config struct {
	RedisHost          string
	RedisPort          string
	AWSAccessKeyID     string
	AWSSecretAccessKey string
	SendGridAPIKey     string
	DevEnv             string
}

var AppConfig Config

func LoadConfig() {

	AppConfig = Config{
		RedisHost:          os.Getenv("REDIS_HOST"),
		RedisPort:          os.Getenv("REDIS_PORT"),
		AWSAccessKeyID:     os.Getenv("ACCESS_KEY_ID"),
		AWSSecretAccessKey: os.Getenv("SECRET_ACCESS_KEY"),
		SendGridAPIKey:     os.Getenv("SENDGRID_API_KEY"),
		DevEnv:             os.Getenv("DEV_ENV"),
	}

	// Validate the configuration
	if AppConfig.RedisHost == "" {
		panic("REDIS_HOST is required")
	}
	if AppConfig.RedisPort == "" {
		panic("REDIS_PORT is required")
	}
	if AppConfig.AWSAccessKeyID == "" {
		panic("ACCESS_KEY_ID is required")
	}
	if AppConfig.AWSSecretAccessKey == "" {
		panic("SECRET_ACCESS_KEY is required")
	}
	if AppConfig.SendGridAPIKey == "" {
		panic("SENDGRID_API_KEY is required")
	}
	if AppConfig.DevEnv == "" {
		panic("DEV_ENV is required")
	}
}
