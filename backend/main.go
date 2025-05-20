package main

import (
	"encoding/json"
	"hideandseek/lib"
	"hideandseek/types"
	"io"
	"net/http"
	"net/url"
)

type UpdateInfo struct {
	Id   string        `json:"id"`
	Team string        `json:"team"`
	No   int           `json:"no"`
	Pos  types.Vector2 `json:"pos"`
}

type Request struct {
	Id string `json:"id"`
}

var Games map[string]types.Game = map[string]types.Game{}

func update(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Request-Method", "*")
	w.Header().Set("Access-Control-Allow-Headers", "*")

	body, err := io.ReadAll(r.Body)
	if err != nil {
		// fmt.Println(err)
		io.WriteString(w, "err a")
		return
	}

	var parsedBody UpdateInfo

	err = json.Unmarshal(body, &parsedBody)

	if err != nil {
		// fmt.Println(err)
		io.WriteString(w, "err b")
		return
	}

	defer r.Body.Close()

	game, exists := Games[parsedBody.Id]

	if !exists {
		game = types.Game{
			Id:             parsedBody.Id,
			AskedQuestions: []string{},
			Hiderspos:      []types.Vector2{},
			Hiderpos:       types.Vector2{},
			Seekerspos:     []types.Vector2{},
			Seekerpos:      types.Vector2{},
			Shapes:         types.Shapes{},
		}
	}

	Games[parsedBody.Id] = game

	if parsedBody.Team == "hiders" && parsedBody.No != -1 {
		if parsedBody.No >= len(game.Hiderspos) {
			game.Hiderspos = append(game.Hiderspos, make([]types.Vector2, parsedBody.No-len(game.Hiderspos)+1)...)
		}
		game.Hiderspos[parsedBody.No] = parsedBody.Pos
		game.Hiderpos = lib.AverageNPoints(game.Hiderspos)
		Games[parsedBody.Id] = game
	} else if parsedBody.Team == "seekers" && parsedBody.No != -1 {
		if parsedBody.No >= len(game.Seekerspos) {
			game.Seekerspos = append(game.Seekerspos, make([]types.Vector2, parsedBody.No-len(game.Seekerspos)+1)...)
		}
		game.Seekerspos[parsedBody.No] = parsedBody.Pos
		game.Seekerpos = lib.AverageNPoints(game.Seekerspos)
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
		http.Error(w, "Error reading querystring", http.StatusInternalServerError)
		// fmt.Println("Error reading querystring")
		io.WriteString(w, "{}")
		return
	}

	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Error reading body", http.StatusInternalServerError)
		// fmt.Println("Error reading body")
		io.WriteString(w, "{}")
		return
	}

	var parsedBody Request

	err = json.Unmarshal(body, &parsedBody)
	if err != nil {
		http.Error(w, "Request body is not valid JSON", http.StatusInternalServerError)
		// fmt.Println("Request body is not valid JSON")
		io.WriteString(w, "{}")
		return
	}

	defer r.Body.Close()

	for _, asked := range Games[parsedBody.Id].AskedQuestions {
		if asked == m.Get("q") {
			http.Error(w, "You cant ask the same question twice", http.StatusConflict)
			// fmt.Println("You cant ask the same question twice")
			io.WriteString(w, "{}")
			return
		}
	}

	game := askQuestion(Games[parsedBody.Id], m.Get("q"))

	game.AskedQuestions = append(game.AskedQuestions, m.Get("q"))
	Games[parsedBody.Id] = game

	io.WriteString(w, "{}")
}

func main() {
	http.HandleFunc("/ask", ask)
	http.HandleFunc("/update", update)

	http.ListenAndServe(":3333", nil)
}
