import { useContext } from 'react'
import { Routes, Route, Outlet } from 'react-router-dom'
import {
  Home, Login, Register, Contact, Professionals,
  Services, Pay, Admin
} from './pages'
import Layout from './pages/layouts/Layout'
import AdminLayout from './pages/layouts/AdminLayout'
import { AuthContext } from './contexts/AuthContext'

// Protected route component for level-based access control
function ProtectedRoute({ minLevel }) {
  const { level } = useContext(AuthContext)

  if (level >= minLevel) {
    return <Outlet />
  } else {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Access Denied</h2>
        <p style={{ color: 'red' }}>You do not have permission to access this page.</p>
        <p>Required access level: {minLevel}</p>
        <p>Your current access level: {level}</p>
      </div>
    )
  }
}

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


      {/* Admin routes with AdminLayout - Protected for level 2+ users */}
      <Route element={<ProtectedRoute minLevel={2} />}>
        <Route path='/admin' element={<AdminLayout />}>
          <Route index element={<Admin />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
