import './seeker.css'
import { useEffect, useState } from 'react'
import Map from './components/map.tsx'
import { update } from "./lib/API.tsx"
import type { Shapes } from './lib/interface.ts'


function Hider() {
  const [shapes, setShapes] = useState<Shapes>();
  const [seeker, setSeeker] = useState<number[]>([0,0]);
  const [hider, setHider] = useState<number[]>([0,0]);
  const [rerenderKey, setRerenderKey] = useState(0);
  const [center, setCenter] = useState([42.36041830331139, -71.0580009624248]);
  const [zoom, setZoom] = useState(13);
  
  async function updateQuestions() {
    let response = await update()
  
    setShapes(response.shapes);
      
    try {
      setHider([response.hiderpos.X, response.hiderpos.Y])
    } catch {
      setHider([0,0])
    }

    try {
      setSeeker([response.seekerpos.X, response.seekerpos.Y])
    } catch {
      setSeeker([0,0])
    }
    setRerenderKey(rerenderKey)
  }

  useEffect(() => {
    updateQuestions()
    setInterval(updateQuestions, 15000);
  }, [])

  return (
    <div className="container">
      <Map
        key={rerenderKey}
        center={center} zoom={zoom}
        shapes={shapes} hider={hider} seeker={seeker}
        update={(center, zoom) => {setCenter(center), setZoom(zoom)}}
      />
    </div>
  )
}

export default Hider
