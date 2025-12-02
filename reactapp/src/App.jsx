import { useState } from 'react'
import {Routes, Route, Link } from 'react-router-dom'
import { Home } from './pages/Home'
import Layout from './pages/layouts/Layout'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Layout >
      <Routes>
        <Route path='/' element={<Home />}></Route>
      </Routes>
    </Layout>
  )
}

export default App
