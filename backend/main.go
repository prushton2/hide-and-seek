package main

import (
	"encoding/json"
	"fmt"
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
	Id  string      `json:"id"`
	Pos lib.Vector2 `json:"pos"`
}

var Games map[string]lib.Game = map[string]lib.Game{}

func update(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Request-Method", "*")
	w.Header().Set("Access-Control-Allow-Headers", "*")

	body, err := io.ReadAll(r.Body)
	if err != nil {
		fmt.Println(err)
		io.WriteString(w, "err a")
		return
	}

	var parsedBody UpdateInfo

	err = json.Unmarshal(body, &parsedBody)

	if err != nil {
		fmt.Println(err)
		io.WriteString(w, "err b")
		return
	}

	defer r.Body.Close()

	game, exists := Games[parsedBody.Id]

	if !exists {
		Games[parsedBody.Id] = lib.Game{
			Id:             parsedBody.Id,
			AskedQuestions: []string{},
			Hiderspos:      []lib.Vector2{},
			Seekerspos:     []lib.Vector2{},
			Shapes:         [][]lib.Vector2{},
		}
	}

	if parsedBody.Team == "hiders" {
		if parsedBody.No >= len(game.Hiderspos) {
			game.Hiderspos = append(game.Hiderspos, make([]lib.Vector2, parsedBody.No-len(game.Hiderspos)+1)...)
		}
		game.Hiderspos[parsedBody.No] = parsedBody.Pos
		Games[parsedBody.Id] = game
	} else if parsedBody.Team == "seekers" {
		if parsedBody.No >= len(game.Seekerspos) {
			game.Seekerspos = append(game.Seekerspos, make([]lib.Vector2, parsedBody.No-len(game.Seekerspos)+1)...)
		}
		game.Seekerspos[parsedBody.No] = parsedBody.Pos
		Games[parsedBody.Id] = game
	}

	encoded, _ := json.Marshal(Games[parsedBody.Id])

	io.Writer.Write(w, encoded)
}

func ask(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Request-Method", "*")
	w.Header().Set("Access-Control-Allow-Headers", "*")

	m, err := url.ParseQuery(r.URL.RawQuery)
	if err != nil {
		io.WriteString(w, "err a")
		return
	}

	body, err := io.ReadAll(r.Body)
	if err != nil {
		io.WriteString(w, "err b")
		return
	}

	var parsedBody Request

	err = json.Unmarshal(body, &parsedBody)
	if err != nil {
		io.WriteString(w, "err c")
		return
	}

	defer r.Body.Close()

	shapes := askQuestion(Games[parsedBody.Id], m.Get("q"))

	game := Games[parsedBody.Id]
	game.Shapes = append(game.Shapes, shapes...)
	Games[parsedBody.Id] = game

	encoded, _ := json.Marshal(shapes)

	io.Writer.Write(w, encoded)
}

func main() {
	http.HandleFunc("/ask", ask)
	http.HandleFunc("/update", update)

	http.ListenAndServe(":3333", nil)
}
