import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styling/index.css'
import { BrowserRouter } from 'react-router-dom';
import Navbar from './components/Navbar';
import Navigator from './components/Navigator';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <div className="h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 overflow-auto">
          <Navigator />
        </div>
      </div>
    </BrowserRouter>
  </StrictMode>
)
