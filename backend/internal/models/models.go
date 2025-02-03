package models

import "encoding/json"

// represents the product description respone
type ProductDescription struct {
	ProductName      string     `json:"product_name"` 		// name of the product
	Description      string     `json:"description"`  		// brief description
	SEOKeywords      StringList `json:"seo_keywords"` 		// SEO keywords
	MarketingBullets StringList `json:"marketing_bullets"` 	// key marketing points
	Hashtags         StringList `json:"hashtags"`         	// social media hashtags
	TargetAudience   StringList `json:"target_audience"`  	// intended audience
	UseCases         StringList `json:"use_cases"`        	// common use cases for the product
	CallToAction     string     `json:"call_to_action"`		// call to action statement encouraging purchase
	PriceEstimate    string     `json:"price_estimate"`		// est price
}

// custom type for handling string arrays in JSON parsing
type StringList []string

// allows StringList to handle both stringarrays and single string vals
func (s *StringList) UnmarshalJSON(data []byte) error {
	var singleValue string
	var listValue []string

	// try to parse as list of strings
	if err := json.Unmarshal(data, &listValue); err == nil {
		*s = listValue
		return nil
	}

	// if parsing as a list fails, parse as a single string and wrap in an array
	if err := json.Unmarshal(data, &singleValue); err == nil {
		*s = []string{singleValue}
		return nil
	}
	// if both attemps fail, return original unmarshalled attempt
	return json.Unmarshal(data, s)
}
