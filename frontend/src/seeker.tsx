import './seeker.css'
import { useEffect, useState, type JSX } from 'react'
import Map from './components/map.tsx'
import { Questions } from './lib/questions.tsx'
import { update } from "./lib/API.tsx"
import type { Shapes, Vector2 } from './lib/interface.ts'

function Seeker() {
  const [shapes, setShapes] = useState<Shapes>();
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
        hider={[0,0]} seeker={seeker}
        update={(c, z) => {center = c; zoom = z}}
      />
      
      <Questions key={"q"} callback={(question) => {updateQuestions()}}/>
    </div>
  )
}

export default Seeker
