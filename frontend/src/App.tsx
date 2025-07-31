import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Auth } from './components/Auth'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import { Page1 } from './pages/page1'
function App() {
  

  return (
    <>
    <div className='bg-blue-500 border border-yellow-100 rounded-md'>ey there</div>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Page1 />}/>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
