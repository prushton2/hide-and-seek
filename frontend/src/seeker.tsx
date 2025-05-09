import './seeker.css'
import { useState } from 'react'
import Map from './map.tsx'
import { questions, type question } from './questions.tsx'

function Questions() {
  const[questionCategory, setQuestionCategory] = useState<string>("");
  
  function renderQuestion(question: question) {
    return <>
      <button className="question" key={question.id} onClick={(e) => {if(question.id == "back") {setQuestionCategory("")} else {console.log(question.id)}}}>
        {/* <img src={question.icon} className="questionIcon"/> */}
        <div className="questionName">{question.name}</div>
        {/* <div className="questionId">{question.id}</div> */}
      </button>
    </>
  }
  function renderQuestionBox() {
    switch (questionCategory) {
      case "":
        return <div className="questionCategoryContainer">
          <button 
            className="questionCategory" 
            onClick={() => setQuestionCategory("Matching")}>
            Matching
          </button>
          <button 
            className="questionCategory" 
            onClick={() => setQuestionCategory("Measuring")}>
            Measuring
          </button>
          <button 
            className="questionCategory" 
            onClick={() => setQuestionCategory("Thermometer")}>
            Thermometer
          </button>
          <button 
            className="questionCategory" 
            onClick={() => setQuestionCategory("Radar")}>
            Radar
          </button>
          <button 
            className="questionCategory" 
            onClick={() => setQuestionCategory("Tentacles")}>
            Tentacles
          </button>
          <button 
            className="questionCategory" 
            onClick={() => setQuestionCategory("Photos")}>
            Photos
          </button>
        </div>
      default:
        return <div className="questionContainer">
          {
          [renderQuestion({name: "Back", id: "back", icon: ""} as question)].concat(
            questions[questionCategory].map(
              (e: question) => {
                return renderQuestion(e)
                }
              )
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
