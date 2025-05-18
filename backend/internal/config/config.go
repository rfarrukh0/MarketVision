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
	if os.Getenv("ENV") != "production" {
		err := godotenv.Load()
		if err != nil {
			log.Println("Warning: .env file not found (expected in production)")
		}	
	}



	return &Config{
		OpenAIKey: os.Getenv("OPENAI_API_KEY"),
		Port:      os.Getenv("PORT"),
	}
}
