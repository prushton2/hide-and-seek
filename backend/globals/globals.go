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

var Corners []types.Vector2 = []types.Vector2{
	{X: Bounds[1].Y, Y: Bounds[0].Y}, // top right
	{X: Bounds[1].X, Y: Bounds[0].Y}, // bottom right
	{X: Bounds[1].X, Y: Bounds[0].X}, // bottom left
	{X: Bounds[1].Y, Y: Bounds[0].X}, // top left
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

func GetAllLocations() (map[string][]types.Vector2, error) {
	file, err := os.Open("globals/locations.json")
	if err != nil {
		return nil, err
	}

	defer file.Close()
	bytes, _ := io.ReadAll(file)

	var LocationsF64 map[string][][]float64
	json.Unmarshal(bytes, &LocationsF64)

	var Locations map[string][]types.Vector2 = make(map[string][]types.Vector2)

	for i := range LocationsF64 {
		Locations[i] = []types.Vector2{}
		for j := range LocationsF64[i] {
			Locations[i] = append(Locations[i], types.Vector2{X: LocationsF64[i][j][0], Y: LocationsF64[i][j][1]})
		}
	}
	return Locations, nil
}
