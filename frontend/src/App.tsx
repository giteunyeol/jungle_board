import './App.css'
import AboutPage from './pages/AboutPage'
import HomePage from './pages/HomePage'
import { Route,Routes } from 'react-router'

function App() {

  return (
    <>
    <Routes>
      <Route path='/' element={<HomePage/>}/>
      <Route path='/about' element={<AboutPage />} />
    </Routes>
    </>
  )
}

export default App
