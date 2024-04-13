import './App.css'
import CharacterCounter from './Components/CharacterCounter'
import { ThemeProvider } from './Context/ThemeContext'

function App() {

  return (
    <ThemeProvider>
      <div className='App'>
        <CharacterCounter />
      </div>
    </ThemeProvider>
  )
}

export default App
