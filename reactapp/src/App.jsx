import { useContext } from 'react'
import { Routes, Route, Outlet } from 'react-router-dom'
import {
  Home, Login, Register, Contact, Professionals,
  Services, Pay, Admin, UserProfile, NotFound
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

          {/* Specific wildcard routes for nested paths */}
          <Route path='professionals/*' element={<NotFound />} />
          <Route path='services/*' element={<NotFound />} />
          <Route path='contact/*' element={<NotFound />} />
          <Route path='pay/*' element={<NotFound />} />
          <Route path='login/*' element={<NotFound />} />
          <Route path='register/*' element={<NotFound />} />

          {/* Base page routes */}
          <Route path='professionals' element={<Professionals />} />
          <Route path='services' element={<Services />} />
          <Route path='contact' element={<Contact />} />
          <Route path='pay' element={<Pay />} />
          <Route path='login' element={<Login />} />
          <Route path='register' element={<Register />} />

          {/* Catch-all route for 404 errors within main layout */}
          <Route path='*' element={<NotFound />} />
        </Route>

      {/* User Profile route - Protected for level 1+ users */}
      <Route element={<ProtectedRoute minLevel={1} />}>
        <Route path='/user_profile' element={<Layout />}>
          <Route index element={<UserProfile />} />
        </Route>
      </Route>

      {/* Admin routes with AdminLayout - Protected for level 3+ users */}
      <Route element={<ProtectedRoute minLevel={3} />}>
        <Route path='/admin' element={<AdminLayout />}>
          <Route index element={<Admin />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
