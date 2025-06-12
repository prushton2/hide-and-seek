import './seeker.css'
import { useEffect, useState } from 'react'
import LeafletMap from './components/map.tsx'
import { getLocations, update } from "./lib/API.tsx"
import type { Shapes, UpdateResponse, Vector2 } from './lib/interface.ts'
import AskedQuestions from './components/AskedQuestions.tsx'
import Menu from './components/burger.tsx'


function Hider() {
  const [seeker, setSeeker] = useState<number[]>([0,0]);
  const [hider, setHider] = useState<number[]>([0,0]);
  const [response, setResponse] = useState<UpdateResponse>({} as UpdateResponse)
  const [locations, setLocations] = useState<Map<string, Vector2[]>>(new Map())
  const [settings, setSettings] = useState<Map<string, any>>(new Map())
  
  let center: number[] = [42.36041830331139, -71.0580009624248]
  let zoom: number = 13
  
  useEffect(() => {
    updateQuestions()
    updateLocations()
    setInterval(updateQuestions, 15000);
  }, [])

  async function updateQuestions() {
    let response = await update()

    setResponse(response)

    try {
      setSeeker([response.seekerpos.X, response.seekerpos.Y])
    } catch {}
    try {
      setHider([response.hiderpos.X, response.hiderpos.Y])
    } catch {}
  }


  async function updateLocations() {
    let locdata = await getLocations()
    let locmap: Map<string, Vector2[]> = new Map()

    for( const key in locdata ) {
      locmap.set(key, locdata[key])
    }

    setLocations(locmap)
  }

  function createMapOptions(locations: Map<string, Vector2[]> | undefined):  {name: string, type: string, initialValue: any}[] {
    let map: {name: string, type: string, initialValue: any}[] = [
      {name: "Settings", type: "header", initialValue: null},
      {name: "Circle Resolution", type: "slider", initialValue: 8},
      {name: "Location Markers", type: "header", initialValue: null},
    ]

    if(locations != undefined) {
      for (const key of locations.keys()) {
        map.push({name: key, type: "switch", initialValue: false})
      }
    }

    map.push({name: "", type: "header", initialValue: null})
    map.push({name: "", type: "header", initialValue: null})
    map.push({name: "", type: "header", initialValue: null})
    return map;

  }

  function getMarkers(): {center: [number, number], radius: number, color: string}[] {
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

  return (
    <div className="container">
      <Menu options={createMapOptions(locations)} onChange={(s) => {setSettings(s)}}/>
      <LeafletMap
        key={""} markers={getMarkers()} circleRes={settings?.get("Circle Resolution") as number}
        center={center} zoom={zoom}
        shapes={response?.shapes} bbox={response?.bbox!}
        hider={hider} seeker={seeker}
        update={(c, z) => {center = c; zoom = z}}
      />
      <AskedQuestions askedQuestions={response?.askedQuestions || []} />
    </div>
  )
}



export default Hider

