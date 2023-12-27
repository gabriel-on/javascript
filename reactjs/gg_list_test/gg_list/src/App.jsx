import Navbar from './components/nav/Navbar'
import { Outlet } from 'react-router-dom'
import Footer from './components/footer/Footer'

import './App.css'
import Breadcrumb from './components/Breadcrumb/Breadcrumb'
import ScrollToTopButton from './components/ScrollToTopButton/ScrollToTopButton'

function App() {
  return (
    <div className='App'>
      <Breadcrumb/>
      <Navbar/>
      <div className='container'>
        <Outlet/>
      </div>
      <ScrollToTopButton/>
      <Footer/>
    </div>
  )
}

export default App
