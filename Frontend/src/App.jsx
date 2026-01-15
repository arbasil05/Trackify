import React, { useCallback, useState } from 'react'
import './App.css'
import Dashboard from './pages/Dashboard';
import { Route, Routes } from 'react-router-dom';
import User from './pages/User';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import SingleCategory from './pages/SingleCategory';
import NotFound from './components/404/NotFound';
import Feedback from './feedback/Feedback';
import Explore from './pages/Explore';
import ForgotPasswordPage from './pages/ForgotPassword';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
          <Routes >
            <Route path='/' element={<Dashboard />} />
            <Route path='/user' element={<User />} />
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<SignUp />} />
            <Route path='/category/:category' element={<SingleCategory />} />
            <Route path='/explore' element={<Explore />} />
            <Route path='/forgot-password' element={<ForgotPasswordPage />} />
            <Route path='/feedback' element={<Feedback />} />
            <Route path='*' element={<NotFound />} />
          </Routes>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
