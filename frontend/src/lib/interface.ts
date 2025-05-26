export interface Vector2 {
    X: number,
    Y: number
}

export interface CenterRadius {
    center: Vector2, 
    radius: number
}


export interface Circle {
    shaded: boolean,
    circles: CenterRadius[]
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
    askedQuestions: string[]
    hiderpos: Vector2
    seekerpos: Vector2
    shapes: Shapes
    bbox: Vector2[]
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