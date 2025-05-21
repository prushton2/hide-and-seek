package main

import (
	"fmt"
	"hideandseek/globals"
	"hideandseek/lib"
	"hideandseek/types"
	"strconv"
	"strings"
)

func askQuestion(ctx types.Game, id string) types.Game {
	switch id {
	case "tentacles-Wendy's":
		fallthrough
	case "tentacles-burger":
		fallthrough
	case "tentacles-McDonald's":
		polygons := tentacles(ctx, strings.Split(id, "-")[1])
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

func radar(ctx types.Game, radiusMeters int) types.Circle { //handles radar calculations in metric
	distance := lib.GetDistanceBetweenLatLong(ctx.Hiderpos, ctx.Seekerpos)
	var circle types.Circle = types.Circle{
		Radius: radiusMeters,
		Center: ctx.Seekerpos,
		Shaded: distance > radiusMeters,
	}
	return circle
}

func tentacles(ctx types.Game, location string) [][]types.Vector2 {
	allLocations, err := globals.GetLocation(location)

	if err != nil {
		fmt.Println(err)
		return [][]types.Vector2{}
	}

	closestPoint, closestIndex := lib.GetClosestPoint(allLocations, ctx.Hiderpos)

	var Shapes [][]types.Vector2 = make([][]types.Vector2, 0)

	for i := range allLocations {
		if i == closestIndex {
			continue
		}

		Shapes = append(Shapes, lib.BoxFarPoint(closestPoint, allLocations[i]))
	}

	return Shapes

}
