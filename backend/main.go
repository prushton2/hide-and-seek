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

	var shape []Vector2 = boxFarPoint(
		Vector2{X: 42.366164, Y: -71.062419},
		Vector2{X: 42.361376, Y: -71.071628},
	);

	for i := 0; i < len(shape); i++ {
		io.WriteString(w, fmt.Sprintf("[%f, %f], ", shape[i].X, shape[i].Y));
	}
}

func main() {
	http.HandleFunc("/", getRoot)
	http.HandleFunc("/hello", getHello)

	http.ListenAndServe(":3333", nil)
}