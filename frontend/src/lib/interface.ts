export interface Vector2 {
    X: number,
    Y: number
}

export interface Shapes {
    fullHighlight: boolean
    polygons: Vector2[][]
    circles: {
        shaded: boolean
        center: Vector2, 
        radius: number
    }[]
}

export interface UpdateResponse {
    id: string,
    askedQuestions: string[],
    hiderspos:  Vector2[]
    hiderpos:   Vector2
    seekerspos: Vector2[]
    seekerpos:  Vector2
    shapes: Shapes
}