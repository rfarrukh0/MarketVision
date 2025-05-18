package api

import (
	"encoding/base64"
	"io"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/rfarrukh0/ai-product-description/internal/service"
)

// simple endpoint to determint if gpt API is running
func HealthCheck(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "API is up and running!",
	})
}

// handles image input and generates the product description
func GenerateProductDescription(svc *service.Service) gin.HandlerFunc {
	return func(c *gin.Context) {
		var imageData []byte
		var err error

		// retrieve image from form data
		file, _, err := c.Request.FormFile("image")
		if err == nil {
			defer file.Close()
			imageData, err = io.ReadAll(file)
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to read image"})
				return
			}
		} else {
			// if no file was uploaded, retrieve from URL
			url := c.PostForm("url")
			if url == "" {
				c.JSON(http.StatusBadRequest, gin.H{"error": "No image file or URL provided"})
				return
			}
			// retrieve from URL
			resp, err := http.Get(url)
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to fetch image from URL"})
				return
			}
			defer resp.Body.Close()
			imageData, err = io.ReadAll(resp.Body)
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to read image from URL"})
				return
			}
		}

		// convert img to base64 string
		base64Image := base64.StdEncoding.EncodeToString(imageData)

		// call service to generate product description
		result, err := svc.GenerateProductDescription(base64Image)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate product description"})
			return
		}

		// return json
		c.JSON(http.StatusOK, result)
	}
}
