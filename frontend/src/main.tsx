import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";
import { Toast } from "radix-ui";
import App from './joingame.tsx'
// import Hider from './hider.tsx'
// import Seeker from './seeker.tsx';
import Game from './game.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Toast.Provider>
      
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App /> } />
        <Route path="/hiders" element={<Game hider/> } />
        <Route path="/seekers" element={<Game seeker/> } />
      </Routes>
    </BrowserRouter>
    
    </Toast.Provider>
  </StrictMode>,
)
