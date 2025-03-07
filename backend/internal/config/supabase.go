package config

import (
	"log"
	"os"
	"github.com/supabase-community/supabase-go"
)

var Supabase *supabase.Client

func InitSupabase() {
	var err error
	Supabase, err = supabase.NewClient(os.Getenv("SUPABASE_URL"), os.Getenv("SUPABASE_SERVICE_ROLE_KEY"), nil)
	if err != nil {
		log.Fatal("Failed to initialize Supabase client:", err)
	}
}
