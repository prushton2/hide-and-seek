package main

import (
	"fmt"
	"hideandseek/globals"
)

func askQuestion(id string) int {
	switch id {
	case "tentacles-mcdonalds":
		tentacles("mcdonalds")
	default:
		fmt.Printf("NOOOO")
	}
	return 0
}

func tentacles(location string) {
	fmt.Printf("%v", globals.Locations[location][0])
}
