import './seeker.css'
import { useEffect, useState, type JSX  } from 'react'
import Map from './components/map.tsx'
import { Questions } from './components/questions.tsx'
import { update } from "./lib/API.tsx"
import { type UpdateResponse, type Shapes, type Vector2, } from './lib/interface.ts'

function Seeker() {
  const [seeker, setSeeker] = useState<number[]>([0,0]);
  const [response, setResponse] = useState<UpdateResponse>()

  let center: number[] = [42.36041830331139, -71.0580009624248]
  let zoom: number = 13

  async function updateQuestions() {
    let response = await update()
    setResponse(response)

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
        key={""} markers={[]}
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
