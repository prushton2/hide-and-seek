package main
import (
	// "errors"
	"fmt"
	"io"
	"net/http"
	// "os"
)

func getRoot(w http.ResponseWriter, r *http.Request) {
	fmt.Printf("got / request\n")
	io.WriteString(w, "This is my website!\n")
}
func getHello(w http.ResponseWriter, r *http.Request) {
	// fmt.Printf("got /hello request\n")

	boxFarPoint(Vector2{X: -71.033, Y: 42.375}, Vector2{X: -71.060516, Y: 42.355477})

	
	io.WriteString(w, "Hello, HTTP!\n")
}

func main() {
	http.HandleFunc("/", getRoot)
	http.HandleFunc("/hello", getHello)

	http.ListenAndServe(":3333", nil)
}