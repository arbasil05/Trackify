import { useEffect, useState } from 'react'
import './App.css'
import Dashboard from './pages/Dashboard';
import { Route, Routes } from 'react-router-dom';
import User from './pages/User';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import SingleCategory from './pages/singleCategory';

function App() {

  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
      const darkMode = localStorage.getItem('isDark') === 'true';
      setIsDark(darkMode);
    }, []);

  useEffect(() => {
    const bodyClass = isDark ? 'dark-mode' : 'light-mode';
    document.body.className = bodyClass;

    const styleTagId = 'dynamic-scrollbar-style';
    let styleTag = document.getElementById(styleTagId);

    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = styleTagId;
      document.head.appendChild(styleTag);
    }

    if (isDark) {
      styleTag.innerHTML = `
      * {
        scrollbar-color: #555 #2c2c2c;
      }

      *::-webkit-scrollbar-track {
        background: #2c2c2c;
      }

      *::-webkit-scrollbar-thumb {
        background-color: #555;
        border: 2px solid #2c2c2c;
      }

      *::-webkit-scrollbar-thumb:hover {
        background-color: #777;
      }
    `;
    } else {
      styleTag.innerHTML = `
      * {
        scrollbar-color: #b1b1b1 #f1f1f1;
      }

      *::-webkit-scrollbar-track {
        background: #f1f1f1;
      }

      *::-webkit-scrollbar-thumb {
        background-color: #b1b1b1;
        border: 2px solid #f1f1f1;
      }

      *::-webkit-scrollbar-thumb:hover {
        background-color: #b1b1b1;
      }
    `;
    }
  }, [isDark]);



  return (
    <>
      <Routes>
        <Route path='/' element={<Dashboard isDark={isDark} setIsDark={setIsDark} />} />
        <Route path='/user' element={<User isDark={isDark} setIsDark={setIsDark} />} />
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<SignUp/>}/>
        <Route path='/category/:category' element={<SingleCategory isDark={isDark} setIsDark={setIsDark} />} />
      </Routes>

    </>
  )
}

export default App
