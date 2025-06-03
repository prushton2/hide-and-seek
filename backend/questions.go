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
	switch strings.Split(id, "-")[0] {
	case "matching":
		polygons := matching(ctx, strings.Split(id, "-")[1])
		ctx.Shapes.Polygons = append(ctx.Shapes.Polygons, polygons...)

	case "measure":
		circles := measure(ctx, strings.Split(id, "-")[1])
		ctx.Shapes.Circles = append(ctx.Shapes.Circles, circles)

	case "tentacles":
		polygons := tentacles(ctx, strings.Split(id, "-")[1], lib.FeetToMeters(1*types.Mile))
		ctx.Shapes.Polygons = append(ctx.Shapes.Polygons, polygons...)

	case "radar":
		distance, _ := strconv.ParseFloat(strings.Split(strings.Split(id, "-")[1], "m")[0], 64)
		circle := radar(ctx, int(distance*float64(lib.FeetToMeters(5280))))
		ctx.Shapes.Circles = append(ctx.Shapes.Circles, circle)

	default:
		fmt.Printf("Fake question, ignoring %s\n", id)
	}
	return ctx
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

func measure(ctx types.Game, location string) types.Circle {
	allLocations, err := globals.GetLocation(location)

	if err != nil {
		fmt.Println(err)
		return types.Circle{}
	}

	SeekerClosest, _ := lib.GetClosestPoint(allLocations, ctx.Seekerpos)
	HiderClosest, _ := lib.GetClosestPoint(allLocations, ctx.Hiderpos)

	SeekerDistance := lib.GetDistanceBetweenLatLong(ctx.Seekerpos, SeekerClosest)
	HiderDistance := lib.GetDistanceBetweenLatLong(ctx.Hiderpos, HiderClosest)

	circle := types.Circle{
		Shaded:  SeekerDistance < HiderDistance,
		Circles: []types.CenterRadius{},
	}

	for i := range allLocations {

		circle.Circles = append(circle.Circles, types.CenterRadius{Center: allLocations[i], Radius: SeekerDistance})
	}

	return circle
}

func tentacles(ctx types.Game, location string, radius int) []types.Polygon {
	// the hider and seeker must be within radius meters
	if lib.GetDistanceBetweenLatLong(ctx.Hiderpos, ctx.Seekerpos) > radius {
		fmt.Printf("%v\n", lib.GetDistanceBetweenLatLong(ctx.Hiderpos, ctx.Seekerpos))
		return []types.Polygon{}
	}

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

		if lib.GetDistanceBetweenLatLong(ctx.Seekerpos, allLocations[i]) > radius {
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
