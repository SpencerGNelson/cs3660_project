import { Routes, Route } from 'react-router-dom'
import {
  Home, Login, Register, Contact, Professionals,
  Services, Pay, Admin, AddProfessional, AddCategory,
  AddService
} from './pages'
import Layout from './pages/layouts/Layout'
import AdminLayout from './pages/layouts/AdminLayout'

function App() {
  return (
      <Routes>
        {/* Main site routes with Layout */}
        <Route path='/' element={<Layout />}>
          <Route index element={<Home />} />
          <Route path='professionals' element={<Professionals />} />
          <Route path='services' element={<Services />} />
          <Route path='contact' element={<Contact />} />
          <Route path='pay' element={<Pay />} />
          <Route path='login' element={<Login />} />
          <Route path='register' element={<Register />} />
        </Route>


      {/* Admin routes with AdminLayout */}
      <Route path='/admin' element={<AdminLayout />}>
        <Route index element={<Admin />} />
        <Route path='add_category' element={<AddCategory />} />
        <Route path='add_service' element={<AddService />} />
        <Route path='add_professional' element={<AddProfessional />} />
      </Route>
    </Routes>
  )
}

export default App
