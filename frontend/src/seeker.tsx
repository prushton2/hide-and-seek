// import { useState } from 'react'
import './seeker.css'
import reactLogo from './assets/react.svg'

function Seeker() {
  
  
  function renderQuestionBox() {

  }


  return (
    <div className="container">
      <img src={reactLogo} className="map"/>
      <div className="questionCategoryContainer">
        <div className="questionCategory">
          Matching
        </div>
        <div className="questionCategory">
          Measuring
        </div>
        <div className="questionCategory">
          Thermometer
        </div>
        <div className="questionCategory">
          Radar
        </div>
        <div className="questionCategory">
          Tentacles
        </div>
        <div className="questionCategory">
          Photos
        </div>
      </div>
    </div>
  )
}

export default Seeker
