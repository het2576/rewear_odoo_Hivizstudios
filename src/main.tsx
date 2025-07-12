import { createRoot } from 'react-dom/client'
import './shadcn.css'
import App from './App'

// Apply dark theme globally
document.documentElement.classList.add('dark')

const root = createRoot(document.getElementById('app')!)
root.render(<App />)
