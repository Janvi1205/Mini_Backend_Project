import React from 'react'
import Login from './pages/Login'
import SignIn from './pages/SignIn'
import { Navigate, Route, Routes } from 'react-router-dom'
import Profile from './pages/Profile'
import EditProfile from './pages/EditProfile'


const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path='/login' element={<Login />} />
      <Route path='/signin' element={<SignIn />} />
      <Route path='/profile' element={<Profile/>}/>
      <Route path='/edit-profile' element={<EditProfile/>}/>
      
      
    </Routes>
  )
  
}


export default App