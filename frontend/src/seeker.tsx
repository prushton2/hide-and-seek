import './seeker.css'

import { useEffect, useState } from 'react'

import LeafletMap from './components/map.tsx'
import { Questions } from './components/questions.tsx'
import { getLocations, update } from "./lib/API.tsx"
import { type UpdateResponse, type Vector2 } from './lib/interface.ts'
import Menu from './components/burger.tsx'

function Seeker() {
  const [seeker, setSeeker] = useState<number[]>([0,0]);
  const [response, setResponse] = useState<UpdateResponse>()
  const [locations, setLocations] = useState<Map<string, Vector2[]>>(new Map())
  const [settings, setSettings] = useState<Map<string, any>>(new Map())

  // let settings: Map<string, any> = new Map();
  let center: number[] = [42.36041830331139, -71.0580009624248]
  let zoom: number = 13
  console.log("rerender")

  async function updateQuestions() {
    let response = await update()

    setResponse(response)

    try {
      setSeeker([response.seekerpos.X, response.seekerpos.Y])
    } catch {}
  }

  async function updateLocations() {
    let locdata = await getLocations()
    let locmap: Map<string, Vector2[]> = new Map()

    for( const key in locdata ) {
      console.log(key)
      locmap.set(key, locdata[key])
    }

    setLocations(locmap)
  }

  useEffect(() => {
    updateLocations()
    updateQuestions()
    setInterval(updateQuestions, 15000);
  }, [])

  function createMapOptions(locations: Map<string, Vector2[]> | undefined):  {name: string, type: string, initialValue: any}[] {
    let map: {name: string, type: string, initialValue: any}[] = [
      {name: "Settings", type: "header", initialValue: null},
      {name: "Circle Resolution", type: "slider", initialValue: 32},
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

    let colors = ["red", "orange", "yellow", "green", "blue", "violet", "grey", "white"];
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
        hider={[0,0]} seeker={seeker}
        update={(c, z) => {center = c; zoom = z}}
      />
      
      <Questions key={"q"} askedQuestions={response?.askedQuestions!} callback={() => {updateQuestions()}}/>

    </div>
  )
}

export default Seeker
