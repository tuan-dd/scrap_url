package main

import (
	"stay-mate/1.0/internal/routers"
)

func main() {
	r := routers.NewRouter()

	r.Run(":3000")
}
