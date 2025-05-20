package globals

import (
	"encoding/json"
	"hideandseek/types"
	"io"
	"os"
)

var Bounds = []types.Vector2{
	{X: -71.269668, Y: -70.621710}, // left to right
	{X: 42.203745, Y: 42.526848},   // bottom to top
}

var Locations = map[string][]types.Vector2{
	"mcdonalds": []types.Vector2{
		{X: 42.351961624715855, Y: -71.05466661133468},
		{X: 42.355639260444500, Y: -71.06292070167730},
		{X: 42.366031241703496, Y: -71.06274491976374},
		{X: 42.357264676803034, Y: -71.05772595541906},
		{X: 42.365632676602670, Y: -71.09849448274935},
		{X: 42.350397670721435, Y: -71.09290666484465},
	},
}

func GetLocation(name string) ([]types.Vector2, error) {
	file, err := os.Open("globals/locations.json")
	if err != nil {
		// fmt.Errorf("failed to open file: %w", err)
		return []types.Vector2{}, err
	}

	defer file.Close()
	bytes, err := io.ReadAll(file)
	if err != nil {
		// fmt.Errorf("failed to read file: %w", err)
		return []types.Vector2{}, err
	}

	var Locations map[string][][]float64
	err = json.Unmarshal(bytes, &Locations)
	if err != nil {
		// fmt.Errorf("failed to unmarshal JSON: %w", err)
		return []types.Vector2{}, err
	}

	var arr = []types.Vector2{}
	for i := 0; i < len(Locations[name]); i++ {
		arr = append(arr, types.Vector2{X: Locations[name][i][0], Y: Locations[name][i][1]})
	}

	return arr, nil

}
