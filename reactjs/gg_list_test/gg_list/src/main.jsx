import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'

// PAGINAS
import Home from './routes/home/Home.jsx'
import NewPost from './routes/new/NewPost.jsx'
import Admin from './routes/admin/Admin.jsx'
import EditPost from './routes/edit/EditPost.jsx'
import Post from './routes/post/Post.jsx'

const router = createBrowserRouter([
  {
    element:<App/>,
    children: [
      {
        path: "/",
        element: <Home/>
      },
      {
        path: "/new",
        element: <NewPost/>
      },
      {
        path: "/posts/:id",
        element: <Post/>
      },
      {
        path: "/admin",
        element: <Admin/>
      },
      {
        path: "/posts/edit/:id",
        element: <EditPost/>
      }
    ]
  }
]) 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
