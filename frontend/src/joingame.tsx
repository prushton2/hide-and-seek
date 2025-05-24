import { useEffect, useState, type JSX } from 'react'
import { join, playerInfo } from './lib/API'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [team, setTeam] = useState<string>("")
  const [code, setCode] = useState<string>("")
  const [rejoinButton, setRejoinButton] = useState<JSX.Element>(<></>)
  
  // https://sonner.emilkowal.ski/

  async function joinGame() {
    let response = await join(code, team)
    localStorage.setItem("key", response.key)
    window.location.href = "/" + team
  }

  async function getRejoinButton() {
    if(localStorage.getItem("key") == null) {
      return
    }

    try {
      let player = await playerInfo(localStorage.getItem("key") as string)

      console.log(player)
      
      setRejoinButton(<button onClick={() => {window.location.href = `/${player.team}`}}>
        Rejoin Game
      </button>)

    } catch (e) {
      return
    }
  }
  
  useEffect(() => {
    if(team != "") {
      localStorage.setItem("team", team)
    }
    if(code != "") {
      localStorage.setItem("code", code)
    }
  }, [team, code])
  
  useEffect(() => {
    setTeam(localStorage.getItem("team") + "")
    setCode(localStorage.getItem("code") + "")

    getRejoinButton()

  }, [])

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
            setCode(e.target.value)
          }}
          value={code}
        />
        <br />
        <button onClick={() => {setTeam("hiders")}} style={{backgroundColor: team == "hiders" ? "#103fa5" : "#1a1a1a"}}>
          Hider
        </button>
        <button onClick={() => {setTeam("seekers")}} style={{backgroundColor: team == "seekers" ? "#103fa5" : "#1a1a1a"}}>
          Seeker
        </button>
        <br />
        <br />
        {rejoinButton}
        <br />
        <button onClick={joinGame}>
          Join Game
        </button>
      </div>
      <p className="read-the-docs">
      </p>
    </>
  )
}

export default App
