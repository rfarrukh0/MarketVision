package main

import (
	"github.com/rfarrukh0/ai-product-description/internal/api"
	"github.com/rfarrukh0/ai-product-description/internal/config"
)

func main() {
	
	cfg := config.LoadConfig()
	config.InitSupabase()
	server := api.NewServer(cfg)
	server.Run()
}
