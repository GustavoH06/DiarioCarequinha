import { useState, useEffect } from 'react'
import Navbar from './blueprints/Navbar'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router";
import Home     from './pages/Home'
import SalaInfo from './pages/SalaInfo'
import SalaForm from './pages/SalaForm'
import SalaList from './pages/SalaList'
import AlunoList from './pages/AlunoList'
import AlunoInfo from './pages/AlunoInfo'
import AlunoForm from './pages/AlunoForm'

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <div className="main-container">
          <Routes>
            <Route path="/home"        element={<Home />} />
            <Route path="/salas/:sid"  element={<SalaInfo />} />
            <Route path="/sala-form"   element={<SalaForm />} />
            <Route path="/sala-list"   element={<SalaList />} />
            <Route path="/aluno-list"  element={<AlunoList />} />
            <Route path="/alunos/:pid" element={<AlunoInfo />} />
            <Route path="/aluno-form"  element={<AlunoForm />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App
