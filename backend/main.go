package main

import (
	"encoding/json"
	"fmt"
	"hideandseek/globals"
	"hideandseek/lib"
	"hideandseek/types"
	"io"
	"net/http"
	"net/url"
	"sync"

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

type LeaveRequest struct {
	Key string `json:"key"`
}

var GamesMutex sync.RWMutex = sync.RWMutex{}
var Games map[string]types.Game = map[string]types.Game{}
var PlayersMutex sync.RWMutex = sync.RWMutex{}
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

	// update the players position if they arent at 0,0
	if !(parsedBody.Pos.X == 0 && parsedBody.Pos.Y == 0) {
		PlayersMutex.Lock()
		player.Pos = parsedBody.Pos
		Players[parsedBody.Key] = player
		PlayersMutex.Unlock()
	}

	// check if game exists
	GamesMutex.Lock()
	game, exists := Games[player.Code]
	GamesMutex.Unlock()

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
	GamesMutex.Lock()
	Games[player.Code] = game
	GamesMutex.Unlock()

	response := types.UpdateResponse{
		AskedQuestions: game.AskedQuestions,
		Hiderpos:       game.Hiderpos,
		Seekerpos:      game.Seekerpos,
		Shapes:         game.Shapes,
		Bbox:           globals.Corners,
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

	PlayersMutex.Lock()
	player, exists := Players[parsedBody.Key]
	PlayersMutex.Unlock()

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
	GamesMutex.Lock()
	Games[player.Code] = game
	GamesMutex.Unlock()

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

	PlayersMutex.Lock()
	_, exists := Players[id]
	for exists {
		id = uuid.New().String()
		_, exists = Players[id]
	}
	PlayersMutex.Unlock()

	// get game to get the player number
	GamesMutex.Lock()
	game, exists := Games[parsedBody.Code]
	GamesMutex.Unlock()
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
				Polygons: []types.Polygon{},
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

	PlayersMutex.Lock()
	Players[id] = player
	PlayersMutex.Unlock()

	GamesMutex.Lock()
	Games[parsedBody.Code] = game
	GamesMutex.Unlock()

	io.WriteString(w, fmt.Sprintf("{\"key\": \"%s\"}", id))
}

func leave(w http.ResponseWriter, r *http.Request) {
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
	var parsedBody LeaveRequest
	err = json.Unmarshal(body, &parsedBody)
	if err != nil {
		http.Error(w, "Body is not valid JSON", http.StatusBadRequest)
		io.WriteString(w, "{}")
		return
	}
	defer r.Body.Close()

	// get the player
	PlayersMutex.Lock()
	player, exists := Players[parsedBody.Key]
	PlayersMutex.Unlock()

	if !exists {
		io.WriteString(w, "{\"status\": \"Player doesnt exist\"}")
		return
	}

	// get game to get the player number
	GamesMutex.Lock()
	game, exists := Games[player.Code]
	GamesMutex.Unlock()

	// create game if not exists
	if exists {
		if player.Team == "hiders" {
			for i, e := range game.Hiders {
				if e == parsedBody.Key {
					game.Hiders = append(game.Hiders[:i], game.Hiders[i+1:]...)
				}
			}
		} else if player.Team == "seekers" {
			for i, e := range game.Seekers {
				if e == parsedBody.Key {
					game.Seekers = append(game.Seekers[:i], game.Seekers[i+1:]...)
				}
			}
		}

		GamesMutex.Lock()
		if len(game.Seekers)+len(game.Hiders) >= 1 {
			Games[player.Code] = game
		} else {
			delete(Games, game.Id)
		}
		GamesMutex.Unlock()
	}

	PlayersMutex.Lock()
	delete(Players, parsedBody.Key)
	PlayersMutex.Unlock()

	io.WriteString(w, "{\"status\": \"deleted player and left game\"}")
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

	PlayersMutex.Lock()
	player, exists := Players[parsedBody.Key]
	PlayersMutex.Unlock()

	if !exists {
		http.Error(w, "Player doesnt exist", http.StatusNotFound)
		io.WriteString(w, "{}")
		return
	}

	GamesMutex.Lock()
	_, exists = Games[player.Code]
	GamesMutex.Unlock()

	if !exists {
		http.Error(w, "Game doesnt exist", http.StatusNotFound)
		io.WriteString(w, "{}")
		return
	}

	bytes, _ := json.Marshal(player)

	io.Writer.Write(w, bytes)
}

func getLocations(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Request-Method", "*")
	w.Header().Set("Access-Control-Allow-Headers", "*")

	m, err := url.ParseQuery(r.URL.RawQuery)
	if err != nil {
		http.Error(w, "Error reading querystring (is there a querystring?)", http.StatusBadRequest)
		io.WriteString(w, "{}")
		return
	}

	if m.Get("location") == "" {
		response, err := globals.GetAllLocations()
		if err != nil {
			http.Error(w, "Error getting all locations", http.StatusInternalServerError)
			io.WriteString(w, "{}")
			return
		}

		bytes, _ := json.Marshal(response)
		io.Writer.Write(w, bytes)
		return
	}

	response, err := globals.GetLocation(m.Get("location"))
	if err != nil {
		http.Error(w, "Ensure a correct location name", http.StatusBadRequest)
		io.WriteString(w, "{}")
		return
	}

	bytes, _ := json.Marshal(response)
	io.Writer.Write(w, bytes)
}

func main() {
	Players["0bac5ee8-d63f-484b-88ef-1d5751036a73"] = types.Player{
		Team: "hiders",
		No:   0,
		Code: "1513",
		Pos:  types.Vector2{X: 42.352157, Y: -71.045398},
	}

	Players["1b1ff218-c083-45c0-86f7-c0069a9dd87e"] = types.Player{
		Team: "seekers",
		No:   0,
		Code: "1513",
		Pos:  types.Vector2{X: 42.37157155614878, Y: -71.03946867851995},
	}

	Games["1513"] = types.Game{
		Id:             "1513",
		AskedQuestions: []string{},
		Hiders:         []string{"0bac5ee8-d63f-484b-88ef-1d5751036a73"},
		Hiderpos:       types.Vector2{X: 42.352157, Y: -71.045398},
		Seekers:        []string{"1b1ff218-c083-45c0-86f7-c0069a9dd87e"},
		Seekerpos:      types.Vector2{X: 42.37157155614878, Y: -71.03946867851995},
		Shapes: types.Shapes{
			Polygons: []types.Polygon{},
			Circles:  []types.Circle{},
		},
	}

	http.HandleFunc("/ask", ask)
	http.HandleFunc("/update", update)
	http.HandleFunc("/join", join)
	http.HandleFunc("/leave", leave)
	http.HandleFunc("/playerInfo", playerInfo)
	http.HandleFunc("/getLocations", getLocations)

	fmt.Println("Running Server")
	http.ListenAndServe(":3333", nil)
}
