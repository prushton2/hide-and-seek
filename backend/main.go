package main

import (
	"encoding/json"
	"fmt"
	"hideandseek/lib"
	"hideandseek/types"
	"io"
	"net/http"
	"net/url"

	"github.com/google/uuid"
)

type UpdateInfo struct {
	Key string        `json:"key"`
	Pos types.Vector2 `json:"pos"`
}

type AskRequest struct {
	Key string `json:"key"`
}

type JoinRequest struct {
	Team string `json:"team"`
	Code string `json:"code"`
}

var Games map[string]types.Game = map[string]types.Game{}
var Players map[string]types.Player = map[string]types.Player{}

func update(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Request-Method", "*")
	w.Header().Set("Access-Control-Allow-Headers", "*")

	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Error reading request body (is this a post request?)", http.StatusBadRequest)
		io.WriteString(w, "{}")
		return
	}

	// parse the body
	var parsedBody UpdateInfo
	err = json.Unmarshal(body, &parsedBody)
	if err != nil {
		http.Error(w, "Body is not valid JSON", http.StatusBadRequest)
		io.WriteString(w, "{}")
		return
	}

	defer r.Body.Close()

	// check if player exists
	player, exists := Players[parsedBody.Key]
	if !exists {
		http.Error(w, "Invalid Key", http.StatusForbidden)
		io.WriteString(w, "{}")
		return
	}

	// update the players position
	player.Pos = parsedBody.Pos
	Players[parsedBody.Key] = player

	// check if game exists
	game, exists := Games[player.Code]
	if !exists {
		http.Error(w, "Game doesnt exist", http.StatusTeapot)
		io.WriteString(w, "{}")
		return
	}

	// average the positions of the hiders
	var hiderspos []types.Vector2 = []types.Vector2{}
	for i := range game.Hiders {
		hiderspos = append(hiderspos, Players[game.Hiders[i]].Pos)
	}
	game.Hiderpos = lib.AverageNPoints(hiderspos)

	// average the positions of the seekers
	var seekerspos []types.Vector2 = []types.Vector2{}
	for i := range game.Seekers {
		seekerspos = append(seekerspos, Players[game.Seekers[i]].Pos)
	}
	game.Seekerpos = lib.AverageNPoints(seekerspos)

	// write to game
	Games[player.Code] = game

	response := types.UpdateResponse{
		AskedQuestions: game.AskedQuestions,
		Hiderpos:       game.Hiderpos,
		Seekerpos:      game.Seekerpos,
		Shapes:         game.Shapes,
	}

	encoded, err := json.Marshal(response)

	if err != nil {
		fmt.Printf("%v", err)
		http.Error(w, "Error encoding game", http.StatusInternalServerError)
		io.WriteString(w, "{}")
		return
	}

	io.Writer.Write(w, encoded)
}

func ask(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Request-Method", "*")
	w.Header().Set("Access-Control-Allow-Headers", "*")

	m, err := url.ParseQuery(r.URL.RawQuery)
	if err != nil {
		http.Error(w, "Error reading querystring (is there a querystring?)", http.StatusBadRequest)
		io.WriteString(w, "{}")
		return
	}

	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Error reading body (is this a post request?)", http.StatusBadRequest)
		io.WriteString(w, "{}")
		return
	}

	var parsedBody AskRequest

	err = json.Unmarshal(body, &parsedBody)
	if err != nil {
		http.Error(w, "Request body is not valid JSON", http.StatusBadRequest)
		io.WriteString(w, "{}")
		return
	}

	defer r.Body.Close()

	player, exists := Players[parsedBody.Key]

	if !exists {
		http.Error(w, "Invalid Key", http.StatusForbidden)
		io.WriteString(w, "{}")
		return
	}

	for _, asked := range Games[player.Code].AskedQuestions {
		if asked == m.Get("q") {
			http.Error(w, "You cant ask the same question twice", http.StatusConflict)
			io.WriteString(w, "{}")
			return
		}
	}

	game := askQuestion(Games[player.Code], m.Get("q"))

	game.AskedQuestions = append(game.AskedQuestions, m.Get("q"))
	Games[player.Code] = game

	io.WriteString(w, "{}")
}

func join(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Request-Method", "*")
	w.Header().Set("Access-Control-Allow-Headers", "*")

	// read the body
	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Error reading request body (is this a post request?)", http.StatusBadRequest)
		io.WriteString(w, "{}")
		return
	}

	// parse the body
	var parsedBody JoinRequest
	err = json.Unmarshal(body, &parsedBody)
	if err != nil {
		http.Error(w, "Body is not valid JSON", http.StatusBadRequest)
		io.WriteString(w, "{}")
		return
	}
	defer r.Body.Close()

	// create a uuid that doesnt exist yet
	id := uuid.New().String()
	_, exists := Players[id]
	for exists {
		id = uuid.New().String()
		_, exists = Players[id]
	}

	// get game to get the player number
	game, exists := Games[parsedBody.Code]
	No := 0

	// create game if not exists
	if !exists {
		game = types.Game{
			Id:             parsedBody.Code,
			AskedQuestions: []string{},
			Hiders:         []string{},
			Hiderpos:       types.Vector2{X: 0, Y: 0},
			Seekers:        []string{},
			Seekerpos:      types.Vector2{X: 0, Y: 0},
			Shapes: types.Shapes{
				Polygons: [][]types.Vector2{},
				Circles:  []types.Circle{},
			},
		}
	}

	// add to team
	if parsedBody.Team == "hiders" {
		No = len(game.Hiders)
		game.Hiders = append(game.Hiders, id)
	} else if parsedBody.Team == "seekers" {
		No = len(game.Seekers)
		game.Seekers = append(game.Seekers, id)
	}

	// create player
	player := types.Player{
		Team: parsedBody.Team,
		No:   No,
		Code: parsedBody.Code,
		Pos:  types.Vector2{X: 0, Y: 0},
	}

	Players[id] = player
	Games[parsedBody.Code] = game

	io.WriteString(w, fmt.Sprintf("{\"key\": \"%s\"}", id))
}

func playerInfo(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Request-Method", "*")
	w.Header().Set("Access-Control-Allow-Headers", "*")

	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Error reading body (is this a post request?)", http.StatusBadRequest)
		io.WriteString(w, "{}")
		return
	}

	var parsedBody AskRequest

	err = json.Unmarshal(body, &parsedBody)
	if err != nil {
		http.Error(w, "Request body is not valid JSON", http.StatusBadRequest)
		io.WriteString(w, "{}")
		return
	}

	defer r.Body.Close()

	player, exists := Players[parsedBody.Key]

	if !exists {
		http.Error(w, "Player doesnt exist", http.StatusNotFound)
		io.WriteString(w, "{}")
		return
	}

	_, exists = Games[player.Code]

	if !exists {
		http.Error(w, "Game doesnt exist", http.StatusNotFound)
		io.WriteString(w, "{}")
		return
	}

	bytes, _ := json.Marshal(player)

	io.Writer.Write(w, bytes)
}

func main() {
	http.HandleFunc("/ask", ask)
	http.HandleFunc("/update", update)
	http.HandleFunc("/join", join)
	http.HandleFunc("/playerInfo", playerInfo)

	fmt.Println("Running Server")
	http.ListenAndServe(":3333", nil)
}
