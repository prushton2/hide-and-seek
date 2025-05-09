import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";
import App from './joingame.tsx'
import Hider from './hider.tsx'
import Seeker from './seeker.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App /> } />
        <Route path="/hider" element={<Hider /> } />
        <Route path="/seeker" element={<Seeker /> } />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
