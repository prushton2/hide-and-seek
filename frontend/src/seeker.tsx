import './seeker.css'
import './burger.css'
import './switch.css'

import { useEffect, useState } from 'react'
import { slide as Menu } from 'react-burger-menu'

import Map from './components/map.tsx'
import { Questions } from './components/questions.tsx'
import { getLocations, update } from "./lib/API.tsx"
import { type UpdateResponse, type Vector2 } from './lib/interface.ts'

function Seeker() {
  const [seeker, setSeeker] = useState<number[]>([0,0]);
  const [response, setResponse] = useState<UpdateResponse>()
  const [locations, setLocations] = useState<Map<string, Vector2[]>>()
  const [selectedLocations, setSelectedLocations] = useState<string[]>()

  let center: number[] = [42.36041830331139, -71.0580009624248]
  let zoom: number = 13

  async function updateQuestions() {
    let response = await update()

    setResponse(response)

    try {
      setSeeker([response.seekerpos.X, response.seekerpos.Y])
    } catch {}
  }

  async function updateLocations() {
    setLocations(await getLocations())
  }

  useEffect(() => {
    updateQuestions()
    updateLocations()
    setInterval(updateQuestions, 15000);
  }, [])

  return (
    <div className="container">
      <Menu right>
        <div className='bm-switch'>
          <label className='bm-switch-label'>
            McDonalds
          </label>
          <label className="switch">
            <input type="checkbox" onChange={(e) => {console.log(e.target.checked)}}/>
            <span className="slider"></span>
          </label>
        </div>
      </Menu>

      <Map
        key={""} markers={[]}
        center={center} zoom={zoom}
        shapes={response?.shapes} bbox={response?.bbox!}
        hider={[0,0]} seeker={seeker}
        update={(c, z) => {center = c; zoom = z}}
      />
      
      <Questions key={"q"} askedQuestions={response?.askedQuestions!} callback={() => {updateQuestions(); console.log(locations)}}/>

    </div>
  )
}

export default Seeker
