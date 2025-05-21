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
