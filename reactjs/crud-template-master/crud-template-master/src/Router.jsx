import { Routes, Route } from "react-router-dom"
import { Feed } from "./pages/Feed" 
import { CreatePost } from "./pages/CreatePost" 
import { UpdatePost } from "./pages/UpdatePost" 
import { OnePost } from "./pages/OnePost" 

export function Router () {
  return (
    <Routes>
        <Route path="/" element={<Feed/>}/>
        <Route path="/new" element={<CreatePost/>}/>
        <Route path="/update/:id" element={<UpdatePost/>}/>
        <Route path="/post/:id" element={<OnePost/>}/>
    </Routes>
  )
}