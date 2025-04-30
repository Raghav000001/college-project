import React, { useEffect } from 'react'
import { useState } from 'react'
import {Header} from '../components/Header'
import { Footer } from '../components/Footer'
import { Contact } from '../components/Contact'
import { useNavigate } from 'react-router-dom'

function Home() {
    const navigate = useNavigate()
    const [isVisible, setIsVisible] = useState(false)
    
    useEffect(() => {
      setIsVisible(true)
    }, [])

    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        
        <main className="flex-grow">
          {/* Hero Section with improved animations and responsiveness */}
          <section id="home" className="bg-gradient-to-br from-blue-700 via-indigo-600 to-purple-700 text-white overflow-hidden relative">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
              <div className="absolute top-36 -left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
              <div className="absolute -bottom-32 right-36 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>
            
            <div className="container mx-auto px-4 py-28 md:py-36 flex flex-col items-center justify-center text-center relative z-10">
              <div className={`transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200 leading-tight">
                  Welcome to Elysium <br className="hidden sm:block" /> Admin Portal
                </h1>
                <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-blue-100 leading-relaxed">
                  Your complete solution for administrative management with powerful tools and intuitive interface
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => navigate('/login')}
                    className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 hover:bg-gradient-to-r hover:from-white hover:to-blue-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
                  >
                    Admin Login
                  </button>
                  <button
                    onClick={() => navigate('/employee/login')}
                    className="bg-transparent text-white border-2 border-white/50 px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
                  >
                    Employee Login
                  </button>
                </div>
              </div>
            </div>
            
            {/* Wave divider */}
            <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-0 transform">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-12 md:h-16 lg:h-24">
                <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" fill="#ffffff"></path>
              </svg>
            </div>
          </section>
          
          {/* Features Section with improved cards and animations */}
          <section id="features" className="py-20 bg-white">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800 relative inline-block">
                  Our Features
                  <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></span>
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">Powerful tools to streamline your administrative workflow</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Feature Card 1 */}
                <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 border border-gray-100">
                  <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mb-6">
                    <span className="text-3xl text-blue-600">📊</span>
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-gray-800">Dashboard Analytics</h3>
                  <p className="text-gray-600">Comprehensive analytics to monitor your business performance with real-time data visualization.</p>
                </div>
                
                {/* Feature Card 2 */}
                <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 border border-gray-100">
                  <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center mb-6">
                    <span className="text-3xl text-indigo-600">🔒</span>
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-gray-800">Secure Access</h3>
                  <p className="text-gray-600">Advanced security protocols to protect your data with role-based access control and encryption.</p>
                </div>
                
                {/* Feature Card 3 */}
                <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 border border-gray-100">
                  <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center mb-6">
                    <span className="text-3xl text-purple-600">📱</span>
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-gray-800">Mobile Friendly</h3>
                  <p className="text-gray-600">Access your admin panel from any device, anywhere with our fully responsive design.</p>
                </div>
                
                {/* Feature Card 4 */}
                <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 border border-gray-100">
                  <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mb-6">
                    <span className="text-3xl text-green-600">📝</span>
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-gray-800">Employee Management</h3>
                  <p className="text-gray-600">Efficiently manage your workforce with comprehensive employee profiles and performance tracking.</p>
                </div>
                
                {/* Feature Card 5 */}
                <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 border border-gray-100">
                  <div className="w-14 h-14 rounded-full bg-yellow-100 flex items-center justify-center mb-6">
                    <span className="text-3xl text-yellow-600">⏱️</span>
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-gray-800">Attendance Tracking</h3>
                  <p className="text-gray-600">Automated attendance tracking system with detailed reports and insights.</p>
                </div>
                
                {/* Feature Card 6 */}
                <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 border border-gray-100">
                  <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mb-6">
                    <span className="text-3xl text-red-600">💰</span>
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-gray-800">Payroll System</h3>
                  <p className="text-gray-600">Streamlined payroll processing with automatic calculations and tax management.</p>
                </div>
              </div>
            </div>
          </section>
          
          {/* Stats Section - New Addition */}
          <section className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div className="p-6 rounded-xl bg-white shadow-md">
                  <div className="text-4xl font-bold text-blue-600 mb-2">99.9%</div>
                  <p className="text-gray-600">Uptime Reliability</p>
                </div>
                <div className="p-6 rounded-xl bg-white shadow-md">
                  <div className="text-4xl font-bold text-indigo-600 mb-2">10k+</div>
                  <p className="text-gray-600">Active Users</p>
                </div>
                <div className="p-6 rounded-xl bg-white shadow-md">
                  <div className="text-4xl font-bold text-purple-600 mb-2">24/7</div>
                  <p className="text-gray-600">Customer Support</p>
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