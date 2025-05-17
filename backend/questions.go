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
		fmt.Printf("Fake question, ignoring")
		return nil
	}
}

func tentacles(ctx lib.Game, location string) [][]lib.Vector2 {
	allLocations := globals.Locations[location]

	// get hiders closest location
	var closest int = 0
	var closestDist float64 = -1.0
	for i := 0; i < len(allLocations); i++ {
		var relDist float64 = math.Pow(ctx.Hiderpos.X-allLocations[i].X, 2) + math.Pow(ctx.Hiderpos.Y-allLocations[i].Y, 2)
		// fmt.Printf("Closest distance: %v; Relative Distance: %v\n", closestDist, relDist)
		if relDist < closestDist || i == 0 {
			// fmt.Printf("Overtook; closest was %d now %d\n", closest, i)
			closest = i
			closestDist = relDist
		}
	}

	// fmt.Printf("[%f, %f]\n", allLocations[closest].X, allLocations[closest].Y)

	var Shapes [][]lib.Vector2 = make([][]lib.Vector2, 0)

	for i := 0; i < len(allLocations); i++ {
		// fmt.Printf("Shapes Len: %d\nClosest: %d; index: %d\n", len(Shapes), closest, i)
		if i == closest {
			// fmt.Println("Match")
			continue
		}
		// fmt.Println("No match")

		Shapes = append(Shapes, lib.BoxFarPoint(allLocations[closest], allLocations[i]))
	}

	return Shapes

}
