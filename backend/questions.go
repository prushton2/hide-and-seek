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

	case "matching-McDonald's":
		fallthrough
	case "matching-subway":
		fallthrough
	case "matching-light_rail":
		polygons := matching(ctx, strings.Split(id, "-")[1])
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
		Circles: []types.CenterRadius{
			{
				Radius: radiusMeters,
				Center: ctx.Seekerpos,
			},
		},
		Shaded: distance > radiusMeters,
	}
	return circle
}

func tentacles(ctx types.Game, location string) []types.Polygon {
	allLocations, err := globals.GetLocation(location)

	if err != nil {
		fmt.Println(err)
		return []types.Polygon{}
	}

	closestPoint, closestIndex := lib.GetClosestPoint(allLocations, ctx.Hiderpos)

	var Shapes []types.Polygon = make([]types.Polygon, 0)

	for i := range allLocations {
		if i == closestIndex {
			continue
		}

		var polygon types.Polygon = types.Polygon{
			Shaded: true,
			Outer:  lib.BoxFarPoint(closestPoint, allLocations[i]),
			Holes:  [][]types.Vector2{},
		}

		Shapes = append(Shapes, polygon)
	}
	return Shapes
}

func matching(ctx types.Game, location string) []types.Polygon {
	allLocations, err := globals.GetLocation(location)

	if err != nil {
		fmt.Println(err)
		return []types.Polygon{}
	}
	_, SeekerClosest := lib.GetClosestPoint(allLocations, ctx.Seekerpos)
	_, HiderClosest := lib.GetClosestPoint(allLocations, ctx.Hiderpos)

	var shapes [][]types.Vector2 = [][]types.Vector2{}

	for i := range allLocations {
		if i == SeekerClosest {
			continue
		}
		shapes = append(shapes, lib.BoxFarPoint(allLocations[SeekerClosest], allLocations[i]))
	}

	// if they are different, we are returning a shape that has the far points cut out
	if SeekerClosest != HiderClosest {
		polygon := types.Polygon{
			Shaded: true,
			Outer:  globals.Corners,
			Holes:  shapes,
		}

		return []types.Polygon{polygon}
	}

	// otherwise, we need to turn shapes into a bunch of polygons just like tentacles
	var polygons []types.Polygon
	for i := range shapes {

		var polygon types.Polygon = types.Polygon{
			Shaded: true,
			Outer:  shapes[i],
			Holes:  [][]types.Vector2{},
		}
		polygons = append(polygons, polygon)
	}

	return polygons

}
