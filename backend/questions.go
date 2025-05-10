package main

import "fmt"

type Vector2 struct {
	X, Y float64
}

// -71.269668 < long < -70.621710
// 42.203745 < lat < 42.526848



func getTentacleBox(close, far Vector2) {
	bounds := []Vector2{
		Vector2{X: -71.269668, Y: -70.621710}, // left to right
		Vector2{X: 42.526848, Y: 42.203745},  // bottom to top
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
		Y: -((a.Y - b.Y) / (a.X - b.X)) * (bounds[1].X - midpoint.Y) + midpoint.X,
		Y: bounds[1].X,
	};

	bottom := Vector2 { 
		Y: -((a.Y - b.Y) / (a.X - b.X)) * (bounds[1].X - midpoint.Y) + midpoint.X,
		Y: bounds[1].X,
	};

	fmt.Printf("Left: ", left)
	fmt.Printf("Right: ", right)

}