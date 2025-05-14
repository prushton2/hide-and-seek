package main

import (
	"encoding/json" // Or "encoding/gob" for binary encoding
	"fmt"
	"hideandseek/lib"
	"io"
	"net/http"
	"net/url"
)

type Game struct {
	Id             string         `json:"id"`
	AskedQuestions [64]string     `json:"askedQuestions"`
	Hiderspos      [8]lib.Vector2 `json:"hiderspos"`
	Seekerspos     [8]lib.Vector2 `json:"seekerspos"`
}

type GameInfo struct {
	Games map[string]Game `json:"games"`
}

type UpdateInfo struct {
	Id   string      `json:"id"`
	Team string      `json:"team"`
	No   int         `json:"no"`
	Pos  lib.Vector2 `json:"pos"`
}

var Games map[string]Game = map[string]Game{}

func update(w http.ResponseWriter, r *http.Request) {
	body, err := io.ReadAll(r.Body)
	if err != nil {
		io.WriteString(w, "err")
		return
	}

	var parsedBody UpdateInfo

	err = json.Unmarshal(body, &parsedBody)

	if err != nil {
		io.WriteString(w, "err")
		return
	}

	defer r.Body.Close()

	_, exists := Games[parsedBody.Id]

	if !exists {
		Games[parsedBody.Id] = Game{
			Id:             parsedBody.Id,
			AskedQuestions: [64]string{},
			Hiderspos:      [8]lib.Vector2{},
			Seekerspos:     [8]lib.Vector2{},
		}
	}

	if parsedBody.Team == "hiders" {
		game := Games[parsedBody.Id]
		game.Hiderspos[parsedBody.No] = parsedBody.Pos
		Games[parsedBody.Id] = game
	} else if parsedBody.Team == "seekers" {
		game := Games[parsedBody.Id]
		game.Seekerspos[parsedBody.No] = parsedBody.Pos
		Games[parsedBody.Id] = game
	}

	io.WriteString(w, "{response: \"Updated\"}")
}

func ask(w http.ResponseWriter, r *http.Request) {
	m, err := url.ParseQuery(r.URL.RawQuery)
	if err != nil {
		io.WriteString(w, "err")
		return
	}
	// fmt.Printf(m.Get("q"))

	// fmt.Printf("\n\n")

	body, err := io.ReadAll(r.Body)
	if err != nil {
		io.WriteString(w, "err")

		return
	}

	defer r.Body.Close()

	fmt.Printf("%v\n", string(body))

	askQuestion(m.Get("q"))

	// var shape []lib.Vector2 = boxFarPoint(
	// 	lib.Vector2{X: 42.366164, Y: -71.062419},
	// 	lib.Vector2{X: 42.361376, Y: -71.071628},
	// );

	// for i := 0; i < len(shape); i++ {
	// 	io.WriteString(w, fmt.Sprintf("[%f, %f], ", shape[i].X, shape[i].Y));
	// }
}

func main() {
	http.HandleFunc("/ask", ask)
	http.HandleFunc("/update", update)

	http.ListenAndServe(":3333", nil)
}
