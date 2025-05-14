package main

import (
	"fmt"
	"hideandseek/globals"
	"hideandseek/lib"
	"math"
)

func askQuestion(ctx lib.Game, id string) [][]lib.Vector2 {
	switch id {
	case "tentacles-mcdonalds":
		return tentacles(ctx, "mcdonalds")
	default:
		fmt.Printf("NOOOO")
	}
	return nil
}

func tentacles(ctx lib.Game, location string) [][]lib.Vector2 {
	allLocations := globals.Locations[location]

	// get hiders closest location
	closest := 0
	closestDist := 99999999999999.0
	for i := 0; i < len(allLocations); i++ {
		relDist := math.Pow(ctx.Hiderspos[0].X-allLocations[i].X, 2) + math.Pow(allLocations[i].X-allLocations[i].X, 2)
		if relDist < closestDist {
			closest = i
			closestDist = relDist
		}
	}

	var Shapes [][]lib.Vector2 = make([][]lib.Vector2, 0)

	for i := 0; i < len(allLocations); i++ {
		if i == closest {
			continue
		}

		Shapes = append(Shapes, lib.BoxFarPoint(allLocations[closest], allLocations[i]))
	}

	return Shapes

}
