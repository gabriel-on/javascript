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
    <div className='container'>
      <ul className='main'>
        {repo.map(repo => {
        return (
          <li key={repo.id}>
            <div className='line-tp'>
              <h2>{repo.name}</h2>
              {/* <p>{repo.description}</p> */}
              {/* <img src={"https://avatars.githubusercontent.com/u/124823000?v=4"} alt="foto" /> */}
            </div>
            <div className='info'>
              <p>
                <span>{Intl.DateTimeFormat('pt-BR').format(new Date(repo.created_at))}</span>
              </p>
              <p className='language'>{repo.language}</p>
              <a href={repo.html_url} target='_blank'>Ver mais</a>
            </div>
          </li>
        )
        })}
      </ul>
    </div>
  )
}

export default App
