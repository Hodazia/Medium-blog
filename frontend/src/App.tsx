import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Auth } from './components/Auth'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import { Page1 } from './pages/page1'
import { SignUp } from './pages/SignUp'
import { SignIn } from './pages/SignIn'
import { Blogs } from './pages/Blogs'
import { Blog } from './pages/Blog'
import { BlogEditor } from './pages/CreateBlog'
import { BlogDetails } from './pages/BlogDetails'
import { Profile } from './pages/Profile'

function App() {
  

  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<SignUp/>}/>
      <Route path="/signup" element={<SignUp />} />
      <Route path="/signin" element={<SignIn />} />
      {/* a blog fetched and displayed by their user id */}
      <Route path="/blog/:id" element={<BlogDetails />} />
      {/* create a new blog  */}
      <Route path='/blog/create' element={<BlogEditor/>}/>
      {/* for the home , all the blogs will be fetched okay */}
      <Route path='/blogs' element={<Blogs />}/>
      {/*user specific blogs, */}
      <Route path="/profile/:userId" element={<Profile />} /> 
      <Route />
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
