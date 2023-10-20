import { useEffect, useState } from 'react'
import './App.css'

function App() {

  const [repo, setRepo] = useState([])

  useEffect(() => {
    fetch('https://api.github.com/users/gabriel-on/repos')
    .then(resposne => resposne.json())
    .then(data => setRepo(data))
  }, [])

  return (
    <div>
      <ul>
        {repo.map(repo => {
        return (
          <li key={repo.id}>
            <h2>{repo.name}</h2>
            <p>{repo.language}</p>
            <p> 
              <span>{Intl.DateTimeFormat('pt-BR').format(new Date(repo.created_at))}</span>
            </p>
            <p>{}</p>
            <a href={repo.html_url} target='_blank'>Ver nais</a>
          </li>
        )
        })}
      </ul>
    </div>
  )
}

export default App
