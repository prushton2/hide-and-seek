import './seeker.css'
import { useEffect, useState } from 'react'
import Map from './components/map.tsx'
import { update } from "./lib/API.tsx"
import type { Shapes, Vector2 } from './lib/interface.ts'


function Hider() {
  const [shapes, setShapes] = useState<Shapes>();
  const [hider, setHider] = useState<number[]>([0,0]);
  const [seeker, setSeeker] = useState<number[]>([0,0]);
  const [bbox, setBbox] = useState<Vector2[]>([])

  let center: number[] = [42.36041830331139, -71.0580009624248]
  let zoom: number = 13

  async function updateQuestions() {
    let response = await update()
    
    if(bbox.length == 0) {
      setBbox(response.bbox)
    }

    setShapes(response.shapes);

    try {
      setSeeker([response.seekerpos.X, response.seekerpos.Y])
    } catch {}

    try {
      setHider([response.hiderpos.X, response.hiderpos.Y])
    } catch {}
  }

  useEffect(() => {
    updateQuestions()
    setInterval(updateQuestions, 15000);
  }, [])

  return (
    <div className="container">
      <Map
        key={""}
        center={center} zoom={zoom}
        shapes={shapes} bbox={bbox}
        hider={hider} seeker={seeker}
        update={(c, z) => {center = c; zoom = z}}
      />
    </div>
  )
}

export default Hider
