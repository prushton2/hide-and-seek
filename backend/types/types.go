package types

type Game struct {
	Id             string   `json:"id"`
	AskedQuestions []string `json:"askedQuestions"`
	Hiders         []string `json:"hiders"`
	Hiderpos       Vector2  `json:"hiderpos"`
	Seekers        []string `json:"seekers"`
	Seekerpos      Vector2  `json:"seekerpos"`
	Shapes         Shapes   `json:"shapes"`
}

type Shapes struct {
	Polygons []Polygon `json:"polygons"`
	Circles  []Circle  `json:"circles"`
}

type Polygon struct {
	Shaded bool        `json:"shaded"`
	Outer  []Vector2   `json:"outer"`
	Holes  [][]Vector2 `json:"holes"`
}

type Circle struct {
	Shaded bool    `json:"shaded"`
	Center Vector2 `json:"center"`
	Radius int     `json:"radius"`
}

type GameInfo struct {
	Games map[string]Game `json:"games"`
}

type Vector2 struct {
	X float64 `json:"X"`
	Y float64 `json:"Y"`
}

type Player struct {
	Team string  `json:"team"`
	No   int     `json:"no"`
	Code string  `json:"code"`
	Pos  Vector2 `json:"pos"`
}

type UpdateResponse struct {
	AskedQuestions []string `json:"askedQuestions"`
	Hiderpos       Vector2  `json:"hiderpos"`
	Seekerpos      Vector2  `json:"seekerpos"`
	Shapes         Shapes   `json:"shapes"`
}
