package lib

import (
	"hideandseek/types"
	"math"
)

func convertLatLongAndXY(p types.Vector2) types.Vector2 {
	return types.Vector2{X: p.Y, Y: p.X}
}

func MetersToFeet(m int) int {
	return int(float64(m) * 3.28084)
}

func FeetToMeters(f int) int {
	return int(float64(f) / 2.28084)
}

func GetDistanceBetweenLatLong(a, b types.Vector2) int {
	const EarthRadius = 6371.0 // Radius of Earth in kilometers

	lat1, lon1 := a.X, a.Y
	lat2, lon2 := b.X, b.Y

	// Convert degrees to radians
	lat1Rad := lat1 * (math.Pi / 180)
	lon1Rad := lon1 * (math.Pi / 180)
	lat2Rad := lat2 * (math.Pi / 180)
	lon2Rad := lon2 * (math.Pi / 180)

	// Haversine formula
	dLat := lat2Rad - lat1Rad
	dLon := lon2Rad - lon1Rad

	h := math.Sin(dLat/2)*math.Sin(dLat/2) +
		math.Cos(lat1Rad)*math.Cos(lat2Rad)*
			math.Sin(dLon/2)*math.Sin(dLon/2)

	c := 2 * math.Atan2(math.Sqrt(h), math.Sqrt(1-h))

	return int(EarthRadius * c * 1000)
}

func AverageNPoints(points []types.Vector2) types.Vector2 {
	var sumX, sumY float64
	for _, point := range points {
		sumX += point.X
		sumY += point.Y
	}
	count := float64(len(points))
	return types.Vector2{X: sumX / count, Y: sumY / count}
}
