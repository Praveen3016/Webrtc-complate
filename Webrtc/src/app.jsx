import { useState } from 'react'
import Lobby from './pages/Lobby'
import { Routes , Route } from 'react-router-dom'
import Room from './pages/Room.jsx'

import './App.css'

function App() {
  const [count, setCount] = useState(0)


  return (
    <>
     <Routes>
      <Route path='/' element={<Lobby/>} />
      <Route path='/room/:roomid' element={<Room/>} />
     </Routes>
    </>
  )
}

export default App
