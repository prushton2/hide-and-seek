import './seeker.css'
import { useEffect, useState } from 'react'
import Map from './components/map.tsx'
import { update } from "./lib/API.tsx"
import type { Shapes } from './lib/interface.ts'


function Hider() {
  const [hider, setHider] = useState<number[]>([0,0]);
  const [shapes, setShapes] = useState<Shapes>();
  const [seeker, setSeeker] = useState<number[]>([0,0]);
  
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
  }

  useEffect(() => {
    updateQuestions()
    setInterval(updateQuestions, 15000);
  }, [])

  return (
    <div className="container">
      <Map shapes={shapes} hider={hider} seeker={seeker}/>
    </div>
  )
}

export default Hider
