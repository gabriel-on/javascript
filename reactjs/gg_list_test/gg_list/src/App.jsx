import Navbar from './components/nav/Navbar'
import Footer from './components/footer/Footer'
import { Outlet } from 'react-router-dom'

import './App.css'

function App() {
  return (
    <div className='App'>
      <Navbar/>
      <div className='container'>
        <Outlet/>
      </div>
      <Footer/>
    </div>
  )
}

export default App
