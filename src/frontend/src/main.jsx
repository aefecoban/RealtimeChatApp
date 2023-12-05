import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.scss'
import { ToastContainer } from 'react-toastify';
import UserProvider from './context/UserContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <UserProvider>
      <App />
      <ToastContainer />
    </UserProvider>
  </>,
)
