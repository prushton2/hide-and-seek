import './seeker.css'
import { useEffect, useState } from 'react'
import Map from './map.tsx'
import { questions, type question } from './questions.tsx'
import { update, ask } from "./API.tsx"


function Questions({callback}: {callback: (question: string) => void}) {
  const [questionCategory, setQuestionCategory] = useState<string>("");

  function renderQuestion(question: question) {
    return <button className="question" key={question.id} onClick={async(e) => {
          if(question.id == "back") {
            setQuestionCategory("")
          } else {
            console.log(question.id)
            await ask(question.id, {"a": "b"})
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
      <Questions callback={(question) => {updateQuestions()}}/>
    </div>
  )
}

export default Seeker
