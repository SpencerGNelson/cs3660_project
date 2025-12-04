import { useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import {
  Home, Login, Register, Contact, Professionals,
  Services, Pay, Admin, AddProfessional, AddCategory,
  AddService
} from './pages'
import Layout from './pages/layouts/Layout'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Layout>
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/professionals' element={<Professionals />}></Route>
        <Route path='/services' element={<Services />}></Route>
        <Route path='/contact' element={<Contact />}></Route>
        <Route path='/pay' element={<Pay />}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/register' element={<Register />}></Route>
        <Route path='/admin' element={<Admin />}></Route>
        <Route path='/add_category' element={<AddCategory />}></Route>
        <Route path='/add_service' element={<AddService />}></Route>
        <Route path='/add_professional' element={<AddProfessional />}></Route>
      </Routes>
    </Layout>
  )
}

export default App
