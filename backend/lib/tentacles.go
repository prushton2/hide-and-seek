package lib

import (
	"hideandseek/globals"
	"hideandseek/types"
)

// -71.269668 < long < -70.621710
// 42.203745 < lat < 42.526848
func sortPointIntoArray(point types.Vector2, arr []types.Vector2) []types.Vector2 {
	var output []types.Vector2 = make([]types.Vector2, len(arr)+1)
	var outputSize int = 0
	var sorted bool = false

	// the item is sorted if it follows a clockwise pattern.
	// This is defined as the following: The point must follow the first point that matches one coordinate of the pair.

	output[0] = arr[0]
	outputSize++

	// The exception is the first point, where only the x needs to match. If a point sorts into the end of the array, this prevents it from being added to the start of the array.	if(point.X == arr[0].X) {
	if point.X == arr[0].X {
		output[outputSize] = point
		outputSize++
		sorted = true
	}

	for i := 1; i < len(arr); i++ {
		// if either the x or y coordinate matches, the point is sorted into the array at the succeeding index
		output[outputSize] = arr[i]
		outputSize++

		if (point.X == arr[i].X || point.Y == arr[i].Y) && !sorted {
			output[outputSize] = point
			outputSize++
			sorted = true
		}
	}
	return output
}

func orientation(p, q, r types.Vector2) int {
	// Returns the orientation of the triplet (p, q, r).
	// 0 -> p, q and r are collinear
	// 1 -> Clockwise
	// 2 -> Counterclockwise
	val := (q.Y-p.Y)*(r.X-q.X) - (q.X-p.X)*(r.Y-q.Y)
	if val == 0 {
		return 0
	} else if val > 0 {
		return 1
	} else {
		return 2
	}
}

func doIntersect(p1, q1, p2, q2 types.Vector2) bool {
	// Find the four orientations needed for general and
	// special cases
	o1 := orientation(p1, q1, p2)
	o2 := orientation(p1, q1, q2)
	o3 := orientation(p2, q2, p1)
	o4 := orientation(p2, q2, q1)

	// General case
	if o1 != o2 && o3 != o4 {
		return true
	}

	return false
}

func BoxFarPoint(close, far types.Vector2) []types.Vector2 {
	close = convertLatLongAndXY(close)
	far = convertLatLongAndXY(far)

	corners := []types.Vector2{
		{X: globals.Bounds[0].Y, Y: globals.Bounds[1].Y}, // top right
		{X: globals.Bounds[0].Y, Y: globals.Bounds[1].X}, // bottom right
		{X: globals.Bounds[0].X, Y: globals.Bounds[1].X}, // bottom left
		{X: globals.Bounds[0].X, Y: globals.Bounds[1].Y}, // top left
	}

	midpoint := types.Vector2{
		X: (close.X + far.X) / 2,
		Y: (close.Y + far.Y) / 2,
	}

	left := types.Vector2{
		X: globals.Bounds[0].X,
		Y: midpoint.Y - ((close.X-far.X)/(close.Y-far.Y))*(globals.Bounds[0].X-midpoint.X),
	}
	right := types.Vector2{
		X: globals.Bounds[0].Y,
		Y: midpoint.Y - ((close.X-far.X)/(close.Y-far.Y))*(globals.Bounds[0].Y-midpoint.X),
	}
	top := types.Vector2{
		X: -((close.Y-far.Y)/(close.X-far.X))*(globals.Bounds[1].X-midpoint.Y) + midpoint.X,
		Y: globals.Bounds[1].X,
	}
	bottom := types.Vector2{
		X: -((close.Y-far.Y)/(close.X-far.X))*(globals.Bounds[1].Y-midpoint.Y) + midpoint.X,
		Y: globals.Bounds[1].Y,
	}

	var tanSegment []types.Vector2

	if left.Y < globals.Bounds[1].Y && left.Y > globals.Bounds[1].X {
		tanSegment = append(tanSegment, left)
		corners = sortPointIntoArray(left, corners)
	}

	if right.Y < globals.Bounds[1].Y && right.Y > globals.Bounds[1].X {
		tanSegment = append(tanSegment, right)
		corners = sortPointIntoArray(right, corners)
	}

	if top.X < globals.Bounds[0].Y && top.X > globals.Bounds[0].X {
		tanSegment = append(tanSegment, top)
		corners = sortPointIntoArray(top, corners)
	}

	if bottom.X < globals.Bounds[0].Y && bottom.X > globals.Bounds[0].X {
		tanSegment = append(tanSegment, bottom)
		corners = sortPointIntoArray(bottom, corners)
	}
	var shape []types.Vector2

	for i := 0; i < len(corners); i++ {
		if corners[i] == tanSegment[0] || corners[i] == tanSegment[1] {
			shape = append(shape, convertLatLongAndXY(corners[i]))
			continue
		}
		if !doIntersect(far, corners[i], tanSegment[0], tanSegment[1]) {
			shape = append(shape, convertLatLongAndXY(corners[i]))
		}
	}

	return shape
}
