export interface Vector2 {
    X: number,
    Y: number
}

export interface Circle {
    shaded: boolean
    center: Vector2, 
    radius: number
}

export interface Polygon {
    shaded: boolean,
    outer: Vector2[]
    holes: Vector2[][]
}

export interface Shapes {
    fullHighlight: boolean
    polygons: Polygon[]
    circles: Circle[]
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

export interface JoinResponse {
    key: string
}

export interface PlayerInfo {
    team: string
    no: number  
    code: string
    pos: Vector2
}