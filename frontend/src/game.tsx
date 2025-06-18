import "./game.css"
import { useEffect, useState, type JSX } from "react";
import LeafletMap from './components/map.tsx'
import type { UpdateResponse, Vector2 } from "./lib/interface";
import { getLocations, leave, update } from "./lib/API.tsx";
import Menu from "./components/burger.tsx";
import { Questions } from "./components/questions.tsx";
import AskedQuestions from "./components/AskedQuestions.tsx";

function Game({hider=false, seeker=false}: {hider?: boolean, seeker?: boolean}): JSX.Element {
    if(hider == seeker) {
        return <>Invalid Hider/Seeker Configuration</>
    }

    const [gameInfo, setGameInfo] = useState<UpdateResponse>({} as UpdateResponse)
    const [locations, setLocations] = useState<Map<string, Vector2[]>>(new Map())
    const [menuSettings, setMenuSettings] = useState<Map<string, any>>(new Map())

    let center: number[] = [42.36041830331139, -71.0580009624248]
    let zoom: number = 13

    async function updateGameInfo() {
        let geoloc = await getGeoLocation()
        setGameInfo(await update(geoloc))
    }

    async function updateLocations() {
        let locdata = await getLocations()
        let locmap: Map<string, Vector2[]> = new Map()

        for( const key in locdata ) {
            locmap.set(key, locdata[key])
        }
        setLocations(locmap)
    }

    useEffect(() => {
        updateLocations()
        updateGameInfo()
        setInterval(updateGameInfo, 15000)
    }, [])

    return <div className="container">
        <Menu options={createMapOptions(locations)} onChange={(s) => setMenuSettings(s)}/>
        <LeafletMap
            key={""} markers={createMarkers(locations, menuSettings)} circleRes={menuSettings.get("Circle Resolution") as number}
            center={center} zoom={zoom}
            shapes={gameInfo.shapes} bbox={gameInfo.bbox}
            hider={hider ? gameInfo.hiderpos : {X:0,Y:0}} seeker={gameInfo.seekerpos}
            update={(c, z) => {center = c; zoom = z}}
        />
        {seeker ? <Questions key={"q"} askedQuestions={gameInfo.askedQuestions!} callback={() => {updateGameInfo()}}/> : <></>}
        {hider ? <AskedQuestions askedQuestions={gameInfo.askedQuestions || []} /> : <></>}
    </div>
}

export default Game;

async function leaveGame() {
  if(confirm("Are you sure you would like to exit the game?")) {
    await leave()
    window.location.href = "/"
  }
}

function createMapOptions(locations: Map<string, Vector2[]> | undefined):  {name: string, type: string, initialValue: any}[] {
    let map: {name: string, type: string, initialValue: any}[] = [
        {name: "Settings", type: "header", initialValue: null},
        {name: "Circle Resolution", type: "slider", initialValue: 8},
        {name: "Leave Game", type: "button", initialValue: leaveGame },
        {name: "Location Markers", type: "header", initialValue: null},
    ]

    if(locations != undefined) {
        for (const key of locations.keys()) {
            map.push({name: key, type: "switch", initialValue: false})
        }
    }

    map.push({name: "",   type: "header", initialValue: null})
    map.push({name: " ",  type: "header", initialValue: null})
    map.push({name: "  ", type: "header", initialValue: null})
    return map;
}

function createMarkers(locations: Map<string, Vector2[]>, settings: Map<string, any>): {center: [number, number], radius: number, color: string}[] {
    let markers: {center: [number, number], radius: number, color: string}[] = [];

    if(locations == undefined) {
        return markers;
    }

    let colors = ["blue", "green", "red", "orange", "yellow", "violet", "grey", "white"];
    let colorIndex = 0;

    for (const key of locations.keys()) {
        if(settings.get(key) != true) {
            continue
        }

        const vectors = locations.get(key);

        if (vectors) {
        for (const value of vectors) {
            markers.push({
            center: [value.X, value.Y],
            radius: 2,
            color: colors[colorIndex % colors.length]
            });
        }
        }
        colorIndex++;
    }

    return markers;
}

async function getGeoLocation(): Promise<Vector2> {
    if(!navigator.geolocation) {
        alert("This browser doesnt support geolocation")
        return {X:0,Y:0}
    }

    return new Promise((res, rej) => {
        navigator.geolocation.getCurrentPosition((pos) => {
            res({X: pos.coords.latitude, Y: pos.coords.longitude})
        }, (err) => {
            rej({X:0,Y:0})
        }) 
    })
}