
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Category from './pages/Category'
import PostDetail from './pages/PostDetail'
import CreatePost from './pages/CreatePost'
import ContentModerationPanel from './components/ContentModerationPanel'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sobre" element={<About />} />
            <Route path="/categoria/:category" element={<Category />} />
            <Route path="/post/:id" element={<PostDetail />} />
            <Route path="/criar-post" element={<CreatePost />} />
            <Route path="/moderacao" element={<ContentModerationPanel />} />
          </Routes>
        </main>
        <Footer />
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </div>
    </Router>
  )
}

export default App
