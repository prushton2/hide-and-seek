package main

import (
	"encoding/json" // Or "encoding/gob" for binary encoding
	"hideandseek/lib"
	"io"
	"net/http"
	"net/url"
)

type UpdateInfo struct {
	Id   string      `json:"id"`
	Team string      `json:"team"`
	No   int         `json:"no"`
	Pos  lib.Vector2 `json:"pos"`
}

type Request struct {
	Id string `json:"id"`
}

var Games map[string]lib.Game = map[string]lib.Game{}

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
		Games[parsedBody.Id] = lib.Game{
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
		io.WriteString(w, "erra")
		return
	}

	body, err := io.ReadAll(r.Body)
	if err != nil {
		io.WriteString(w, "errb")
		return
	}

	var parsedBody Request
	err = json.Unmarshal(body, &parsedBody)
	if err != nil {
		io.WriteString(w, "errc")
		return
	}

	defer r.Body.Close()

	shapes := askQuestion(Games[parsedBody.Id], m.Get("q"))

	encoded, _ := json.Marshal(shapes)

	io.Writer.Write(w, encoded)
}

func main() {
	http.HandleFunc("/ask", ask)
	http.HandleFunc("/update", update)

	http.ListenAndServe(":3333", nil)
}
