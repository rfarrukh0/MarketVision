package api

import (
	"fmt"
	"log"
	"github.com/gin-gonic/gin"
	"github.com/rfarrukh0/ai-product-description/internal/config"
	"github.com/rfarrukh0/ai-product-description/internal/service"
	"github.com/gin-contrib/cors"
)

// holds reference to the router, config and service
type Server struct {
	router  *gin.Engine
	config  *config.Config
	service *service.Service
}

// init and return a new server instance
func NewServer(cfg *config.Config) *Server {
	r := gin.Default()  // create new gin router with def middleware
	r.Use(cors.Default()) // enable cors

	// init service layer
	svc := service.NewService(cfg)

	// create server struct
	server := &Server{
		router:  r,
		config:  cfg,
		service: svc,
	}

	// setup api routes
	server.SetupRoutes()

	return server
}

// defines API endpoints and their handlers
func (s *Server) SetupRoutes() {
	s.router.GET("/health", HealthCheck) 
	s.router.POST("/generate", GenerateProductDescription(s.service))
	s.router.GET("/supabase-health", SupabaseHealthCheck)	
}

// starts server 
func (s *Server) Run() {
	log.Printf("Server running on port %s\n", s.config.Port)
	err := s.router.Run(fmt.Sprintf(":%s", s.config.Port))
	if err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
