package service

import (
	"context"
	"encoding/json"
	"log"

	"github.com/sashabaranov/go-openai"
	"github.com/rfarrukh0/ai-product-description/internal/models"
	"github.com/rfarrukh0/ai-product-description/internal/config"
)
// acts as a wrapper for the OpenAI cleint
// enables communnication with the API for the generation
type Service struct {
	client *openai.Client	// client for making requests
}

// initializes a new service with the config, and creates a new client using the API key from the config
func NewService(cfg *config.Config) *Service {
	return &Service{
		client: openai.NewClient(cfg.OpenAIKey),
	}
}

// sends a base64-encoded image and sends it to openAI
func (s *Service) GenerateProductDescription(base64Image string) (*models.ProductDescription, error) {
	resp, err := s.client.CreateChatCompletion(
		context.Background(),
		openai.ChatCompletionRequest{
			Model: "gpt-4o-mini", // lightweight model because cant be burning through tokens in this economy
			MaxTokens: 500,		  // limit response for the same reason aforementioned
			Messages: []openai.ChatCompletionMessage{
				{
					Role: "system",
					Content: "You are an AI specializing in eCommerce product descriptions. Given an image, return ONLY valid JSON. Do not include any text outside the JSON. The JSON must include these fields: `product_name`, `description`, `seo_keywords`, `marketing_bullets`, `hashtags`, `target_audience`, `use_cases`, `call_to_action`, `price_estimate`. Do NOT include markdown, backticks, explanations, or anything other than JSON.",
				},
				{
					Role: "user",
					MultiContent: []openai.ChatMessagePart{
						{ Type: "text", Text: "Analyze the following product image and generate marketing details." },
						{ Type: "image_url", ImageURL: &openai.ChatMessageImageURL{
							URL: "data:image/jpeg;base64," + base64Image,
						}},
					},
				},
			},
		},
	)
	// handling api req error
	if err != nil {
		log.Println("Error calling OpenAI:", err)
		return nil, err
	}

	// parsing the JSON response into the ProductDescription struct
	var result models.ProductDescription
	if err := json.Unmarshal([]byte(resp.Choices[0].Message.Content), &result); err != nil {
		log.Println("Error parsing OpenAI response:", err)
		return nil, err
	}

	return &result, nil // return
}
