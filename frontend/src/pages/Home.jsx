import React from 'react'
import { useState } from 'react'
import {Header} from '../components/Header'
import { Footer } from '../components/Footer'
import { Contact } from '../components/Contact'
import { useNavigate } from 'react-router-dom'


function Home() {
    const navigate=useNavigate()
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <section id="home" className="bg-gradient-to-br from-blue-700 via-indigo-600 to-purple-700 text-white">
          <div className="container mx-auto px-4 py-24 md:py-32 flex flex-col items-center justify-center text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200">Welcome to Elysium Admin Portal</h1>
            <p className="text-xl md:text-2xl mb-10 max-w-2xl text-blue-100">Your complete solution for administrative management</p>
            <button
             onClick={()=> navigate('/login')}
             className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 hover:bg-gradient-to-r hover:from-white hover:to-blue-100">
              Login
            </button>
          </div>
        </section>
        
        <section id="features" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-800">Our Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300">
                <div className="text-5xl mb-6 text-blue-600">📊</div>
                <h3 className="text-xl font-bold mb-4 text-gray-800">Dashboard Analytics</h3>
                <p className="text-gray-600">Comprehensive analytics to monitor your business performance.</p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300">
                <div className="text-5xl mb-6 text-blue-600">🔒</div>
                <h3 className="text-xl font-bold mb-4 text-gray-800">Secure Access</h3>
                <p className="text-gray-600">Advanced security protocols to protect your data.</p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300">
                <div className="text-5xl mb-6 text-blue-600">📱</div>
                <h3 className="text-xl font-bold mb-4 text-gray-800">Mobile Friendly</h3>
                <p className="text-gray-600">Access your admin panel from any device, anywhere.</p>
              </div>
            </div>
          </div>
        </section>
        
        <Contact />
      </main>
      
      <Footer />
    </div>
  )
}

export default Home