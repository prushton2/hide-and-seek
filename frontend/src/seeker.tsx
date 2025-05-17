import './seeker.css'
import { useEffect, useState } from 'react'
import Map from './components/map.tsx'
import { questions, type question } from './lib/questions.tsx'
import { update, ask } from "./lib/API.tsx"
import type { Shapes } from './lib/interface.ts'


function Questions({callback}: {callback: (question: string) => void}) {
  const [questionCategory, setQuestionCategory] = useState<string>("");

  function renderQuestion(question: question) {
    return <button className="question" key={question.id} onClick={async(e) => {
          if(question.id == "back") {
            setQuestionCategory("")
          } else {
            console.log(question.id)
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

  async function updateQuestions() {
    let response = await update()

    setShapes(response.shapes);

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
      <Map shapes={shapes} hider={[0,0]} seeker={seeker}/>
      <Questions callback={(question) => {updateQuestions()}}/>
    </div>
  )
}

export default Seeker
