package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	OpenAIKey string
	Port      string
}

func LoadConfig() *Config {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	return &Config{
		OpenAIKey: os.Getenv("OPENAI_API_KEY"),
		Port:      os.Getenv("PORT"),
	}
}
