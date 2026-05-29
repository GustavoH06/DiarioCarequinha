import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import Navbar from './blueprints/Navbar'
import './App.css'
import axios from 'axios'
import { BrowserRouter as Router, Routes, Route } from "react-router";
import Home from './pages/Home'
import SalaInfo from './pages/SalaInfo'
import SalaForm from './pages/SalaForm'
import SalaList from './pages/SalaList'
import AlunoList from './pages/AlunoList'
import AlunoInfo from './pages/AlunoInfo'
import AlunoForm from './pages/AlunoForm'

function App() {
  /*const [count, setCount] = useState(0)
  const[array, setArray] = useState([]);*/

  const fetchAPI = async () =>{
    const response = await axios.get("http://127.0.0.1:5000/api/alunos")
    console.log(response.data.users);
    setArray(response.data.users);
  };

  useEffect(() =>{
    fetchAPI()
  }, [])



  return (
    <Router>
      <div className="app-container">
        <Navbar/>
        <div className="main-container">
          <Routes>
            <Route path='home' element={<Home/>}></Route>
            <Route path='sala-info' element={<SalaInfo/>}></Route>
            <Route path='sala-form' element={<SalaForm/>}></Route>
            <Route path='sala-List' element={<SalaList/>}></Route>
            <Route path='aluno-list' element={<AlunoList/>}></Route>
            <Route path='aluno-info' element={<AlunoInfo/>}></Route>
            <Route path='aluno-form' element={<AlunoForm/>}></Route>
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App
