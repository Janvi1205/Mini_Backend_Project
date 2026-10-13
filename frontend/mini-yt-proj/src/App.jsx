import React from 'react'
import Login from './pages/Login'
import SignIn from './pages/SignIn'
import { Navigate, Route, Routes } from 'react-router-dom'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path='/login' element={<Login />} />
      <Route path='/signin' element={<SignIn />} />
    </Routes>
  )
}


export default App