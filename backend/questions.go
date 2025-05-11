package main

import "fmt"

func boxFarPoint(close, far Vector2) []Vector2 {
	close = convertLatLongAndXY(close);
	far = convertLatLongAndXY(far);

	bounds := []Vector2{
		Vector2{X: -71.269668, Y: -70.621710}, // left to right
		Vector2{X: 42.203745, Y: 42.526848},  // bottom to top
	};

	corners := []Vector2{
		Vector2{X: bounds[0].Y, Y: bounds[1].Y}, // top right
		Vector2{X: bounds[0].Y, Y: bounds[1].X}, // bottom right
		Vector2{X: bounds[0].X, Y: bounds[1].X}, // bottom left
		Vector2{X: bounds[0].X, Y: bounds[1].Y}, // top left
	};

	midpoint := Vector2{
		X: (close.X + far.X) / 2,
		Y: (close.Y + far.Y) / 2,
	};
	
	left := Vector2 { 
		X: bounds[0].X,
		Y: midpoint.Y - ((close.X - far.X) / (close.Y - far.Y)) * (bounds[0].X - midpoint.X),
	};
	right := Vector2 { 
		X: bounds[0].Y,
		Y: midpoint.Y - ((close.X - far.X) / (close.Y - far.Y)) * (bounds[0].Y - midpoint.X),
	};
	top := Vector2 { 
		X: -((close.Y - far.Y) / (close.X - far.X)) * (bounds[1].X - midpoint.Y) + midpoint.X,
		Y: bounds[1].X,
	};
	bottom := Vector2 { 
		X: -((close.Y - far.Y) / (close.X - far.X)) * (bounds[1].Y - midpoint.Y) + midpoint.X,
		Y: bounds[1].Y,
	};

	var tanSegment []Vector2

	if left.Y < bounds[1].Y && left.Y > bounds[1].X {
		tanSegment = append(tanSegment, left)
		corners = sortPointIntoArray(left, corners)
	}

	if right.Y < bounds[1].Y && right.Y > bounds[1].X {
		tanSegment = append(tanSegment, right)
		corners = sortPointIntoArray(right, corners)
	}

	if top.X < bounds[0].Y && top.X > bounds[0].X {
		tanSegment = append(tanSegment, top)
		corners = sortPointIntoArray(top, corners)
	}

	if bottom.X < bounds[0].Y && bottom.X > bounds[0].X {
		tanSegment = append(tanSegment, bottom)
		corners = sortPointIntoArray(bottom, corners)
	}

	for i := 0; i < len(corners); i++ {
		fmt.Printf("(%f, %f), ", corners[i].X, corners[i].Y);
	}
	
	var shape []Vector2

	for i := 0; i < len(corners); i++ {
		if(corners[i] == tanSegment[0] || corners[i] == tanSegment[1]) {
			shape = append(shape, corners[i])
		}
		if(!doIntersect(far, corners[i], tanSegment[0], tanSegment[1])) {
			shape = append(shape, corners[i])
		}
	}

	fmt.Printf("\nShape: ")
	for i := 0; i < len(shape); i++ {
		shape[i] = convertLatLongAndXY(shape[i]);
		fmt.Printf("(%f, %f), ", shape[i].X, shape[i].Y);
	}

	return shape;
}