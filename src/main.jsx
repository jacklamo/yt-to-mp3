import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Error boundary for React 18
const handleError = (error) => {
  console.error('React Error:', error)
  // You could implement more sophisticated error logging here
}

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

// Add global error handler
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error)
})

// Listen for unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled Promise Rejection:', event.reason)
}) 