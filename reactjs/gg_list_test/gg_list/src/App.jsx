import Navbar from './components/nav/Navbar'
import { Outlet } from 'react-router-dom'
import Footer from './components/footer/Footer'

import './App.css'
import SearchForm from './components/searchForm/SearchForm'

function App() {
  return (
    <div className='App'>
      <Navbar/>
      {/* <SearchForm/> */}
      <div className='container'>
        <Outlet/>
      </div>
      <Footer/>
    </div>
  )
}

export default App
