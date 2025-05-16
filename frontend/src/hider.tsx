import './seeker.css'
import { useEffect, useState } from 'react'
import Map from './map.tsx'
import { update } from "./API.tsx"



function Hider() {
  const [shapes, setShapes] = useState<number[][][]>([[[]]]);
  const [hider, setHider] = useState<number[]>([0,0]);
  const [seeker, setSeeker] = useState<number[]>([0,0]);

  async function updateQuestions() {
    let response = await update()

    let newShapes: number[][][] = []
    if(response.shapes == null) {
      response.shapes = [[]]
    }
    for(let i = 0; i < response.shapes.length; i++) {
      newShapes.push([])
      for(let j = 0; j < response.shapes[i].length; j++) {
        newShapes[i][j] = [response.shapes[i][j].X, response.shapes[i][j].Y]
      }
    }
    // console.log(newShapes)
    setShapes(newShapes)
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
