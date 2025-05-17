import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'

function App() {
  return (
    <>
      <div>
      </div>
      <h1>Join Game</h1>
      <div className='card'>
        <input
          type="number"
          placeholder="Game Code"
          onChange={(e) => {
            localStorage.setItem("code", e.target.value)
          }}
          defaultValue={
            "" + localStorage.getItem("code")
          }
        />
        <input
          type="number"
          placeholder="Player Number"
          onChange={(e) => {
            localStorage.setItem("no", e.target.value)
          }}
          defaultValue={
            "" + localStorage.getItem("no")
          }
        />
      </div>
      <div className="card">
        <button onClick={() => {localStorage.setItem("team", "hider");  window.location.href = "/hider"}}>
          Hider
        </button>
        <button onClick={() => {localStorage.setItem("team", "seeker"); window.location.href = "/seeker"}}>
          Seeker
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
