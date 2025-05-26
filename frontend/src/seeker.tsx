import './seeker.css'
import { useEffect, useState } from 'react'
import Map from './components/map.tsx'
import { questions, type question } from './lib/questions.tsx'
import { update, ask } from "./lib/API.tsx"
import type { Shapes, Vector2 } from './lib/interface.ts'

function Questions({callback}: {callback: (question: string) => void}) {
  const [questionCategory, setQuestionCategory] = useState<string>("");

  function renderQuestion(question: question) {
    return <button className="question" key={question.id} onClick={async(e) => {
        if(question.id == "back") {
          setQuestionCategory("")
        } else {
          await ask(question.id)
          callback(question.id)
        }
      }}>
      <div className="questionName">{question.name}</div>
    </button>
  }
  function renderQuestionBox() {

    if(questionCategory == "") {
      return <div className="questionCategoryContainer">
          <button 
            className="questionCategory" 
            onClick={() => setQuestionCategory("matching")}>
            Matching
          </button>
          <button 
            className="questionCategory" 
            onClick={() => setQuestionCategory("measuring")}>
            Measuring
          </button>
          <button 
            className="questionCategory" 
            onClick={() => setQuestionCategory("thermometer")}>
            Thermometer
          </button>
          <button 
            className="questionCategory" 
            onClick={() => setQuestionCategory("radar")}>
            Radar
          </button>
          <button 
            className="questionCategory" 
            onClick={() => setQuestionCategory("tentacles")}>
            Tentacles
          </button>
          <button 
            className="questionCategory" 
            onClick={() => setQuestionCategory("photos")}>
            Photos
          </button>
        </div>
    } else {
      return <div className="questionContainer">
        {
          [renderQuestion({name: "Back", id: "back", icon: ""} as question)].concat(
            Object.entries(questions)
              .filter((e: [string, question]) => e[0].startsWith(questionCategory))
              .map((e: [string, question]) => {return renderQuestion(e[1])})
          )
        }
      </div>
    }
  }

  return renderQuestionBox()
}

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
