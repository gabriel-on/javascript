import './App.css'
import CharacterCounter from './Components/CharacterCounter/CharacterCounter'
import { ThemeProvider } from './Context/ThemeContext'

function App() {

  return (
    <ThemeProvider>
      <div className='App'>
        <div className='container-main'>
          <CharacterCounter />
        </div>
      </div>
    </ThemeProvider>
  )
}

export default App