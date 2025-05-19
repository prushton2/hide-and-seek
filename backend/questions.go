package main

import (
	"fmt"
	"hideandseek/globals"
	"hideandseek/lib"
	"math"
	"strconv"
	"strings"
)

func askQuestion(ctx lib.Game, id string) lib.Game {
	switch id {
	case "tentacles-mcdonalds":
		polygons := tentacles(ctx, "mcdonalds")
		ctx.Shapes.Polygons = append(ctx.Shapes.Polygons, polygons...)

	case "radar-0.5mi":
		fallthrough
	case "radar-1mi":
		fallthrough
	case "radar-2mi":
		fallthrough
	case "radar-3mi":
		distance, _ := strconv.ParseFloat(strings.Split(strings.Split(id, "-")[1], "m")[0], 64)
		circle := radar(ctx, int(distance*float64(lib.FeetToMeters(5280))))
		ctx.Shapes.Circles = append(ctx.Shapes.Circles, circle)

	default:
		fmt.Printf("Fake question, ignoring %s\n", id)
	}
	return ctx
}

func radar(ctx lib.Game, radiusMeters int) lib.Circle { //handles radar calculations in metric
	distance := lib.GetDistanceBetweenLatLong(ctx.Hiderpos, ctx.Seekerpos)
	var circle lib.Circle = lib.Circle{
		Radius: radiusMeters,
		Center: ctx.Seekerpos,
		Shaded: distance > radiusMeters,
	}
	return circle
}

func tentacles(ctx lib.Game, location string) [][]lib.Vector2 {
	allLocations := globals.Locations[location]

	// get hiders closest location
	var closest int = 0
	var closestDist float64 = -1.0
	for i := 0; i < len(allLocations); i++ {
		var relDist float64 = math.Pow(ctx.Hiderpos.X-allLocations[i].X, 2) + math.Pow(ctx.Hiderpos.Y-allLocations[i].Y, 2)
		if relDist < closestDist || i == 0 {
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
