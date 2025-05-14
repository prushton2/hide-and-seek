import './seeker.css'
import { useState } from 'react'
import Map from './map.tsx'
import { questions, type question } from './questions.tsx'

function Questions() {
  const[questionCategory, setQuestionCategory] = useState<string>("");
  
  function renderQuestion(question: question) {
    return <button className="question" key={question.id} onClick={(e) => {if(question.id == "back") {setQuestionCategory("")} else {console.log(question.id)}}}>
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
  



  return (
    <div className="container">
      <Map />
      <Questions />
    </div>
  )
}

export default Seeker
