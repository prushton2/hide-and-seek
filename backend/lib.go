package main

type Vector2 struct {
	X, Y float64
}

func convertLatLongAndXY(p Vector2) Vector2 {
	return Vector2{p.Y, p.X}
}

// -71.269668 < long < -70.621710
// 42.203745 < lat < 42.526848
func sortPointIntoArray(point Vector2, arr []Vector2) []Vector2 {
	var output []Vector2 = make([]Vector2, len(arr) + 1)
	var outputSize int = 0
	var sorted bool = false

	// the item is sorted if it follows a clockwise pattern.
	// This is defined as the following: The point must follow the first point that matches one coordinate of the pair.

	output[0] = arr[0]
	outputSize++

	// The exception is the first point, where only the x needs to match. If a point sorts into the end of the array, this prevents it from being added to the start of the array.	if(point.X == arr[0].X) {
	if(point.X == arr[0].X) {
		output[outputSize] = point;
		outputSize++;
		sorted = true
	}


	for i := 1; i < len(arr); i++ {
		// if either the x or y coordinate matches, the point is sorted into the array at the succeeding index
		output[outputSize] = arr[i];
		outputSize++;

		if((point.X == arr[i].X || point.Y == arr[i].Y) && !sorted) {
			output[outputSize] = point
			outputSize++
			sorted = true
		}
	}
	return output
}

func orientation(p, q, r Vector2) int {
	// Returns the orientation of the triplet (p, q, r).
	// 0 -> p, q and r are collinear
	// 1 -> Clockwise
	// 2 -> Counterclockwise
	val := (q.Y - p.Y) * (r.X - q.X) - (q.X - p.X) * (r.Y - q.Y)
	if val == 0 {
		return 0
	} else if val > 0 {
		return 1
	} else {
		return 2
	}
}

func doIntersect(p1, q1, p2, q2 Vector2) bool {
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