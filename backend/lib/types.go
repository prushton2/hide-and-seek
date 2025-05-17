package lib

type Game struct {
	Id             string    `json:"id"`
	AskedQuestions []string  `json:"askedQuestions"`
	Hiderspos      []Vector2 `json:"hiderspos"`
	Hiderpos       Vector2   `json:"hiderpos"`
	Seekerspos     []Vector2 `json:"seekerspos"`
	Seekerpos      Vector2   `json:"seekerpos"`
	Shapes         Shapes    `json:"shapes"`
}

type Shapes struct {
	FullHighlight bool        `json:"fullHighlight"`
	Polygons      [][]Vector2 `json:"polygons"`
	Circles       []Circle    `json:"circles"`
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
