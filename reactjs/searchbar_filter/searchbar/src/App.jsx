import { useEffect, useState } from 'react'
import './App.css'
import api from './api/config'
// import SearchResults from './components/searchBar/SearchResults'

function App() {

  // const [data, setData] = useState([])

  // const handleInputChange = (e) => {
  //   e.preventDefault()
  //   const { value } = e.target;

  //   if (!value) return;

  //   const url = `http://localhost:8000/posts?q=${value}`

  //   fetch(url)
  //     .then((response) => response.json())
  //     .then(({ data }) => setData(data))

  // }

  //console.log("Data", data)

  const [posts, setPosts] = useState([])
  const [search, setSearch] = useState("")

  useEffect(() => {
    api.get(`/posts`)
      .then((response) => (setPosts(response.data)))
  }, [])

  return (
    <div className='container'>
      <form action="">
        <label htmlFor="search-bar">Games</label>
        <input type="search" name="search-bar" id="search-bar" onChange={(e) => setSearch(e.target.value)}/>
      </form>
      
      <div key={posts}>
        {posts
          .filter((item) => {
            if (search === ""){
              return item
            } else if (item.title.toLowerCase().includes(search.toLowerCase())){
              return item
            }
          })
          .map((item) => {
            return <div key={item.id}>
              <h4>{item.title}</h4>
              <p>{item.description}</p>
            </div>
          })}
      </div>

      {/* <SearchResults data={data}/> */}
    </div>
  )
}

export default App
