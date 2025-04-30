import { useState } from "react"
import { Link } from "react-router-dom"

export const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-lg transition-all duration-300">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          {/* Logo with animation */}
          <div className="flex items-center space-x-1 group">
            <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold transform group-hover:rotate-12 transition-transform duration-300">E</div>
            <div className="text-2xl font-bold">
              <span className="text-gray-800 group-hover:text-gray-900 transition-colors">Elysium</span>
              <span className="text-blue-600 group-hover:text-blue-700 transition-colors">Payroll</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <ul className="flex space-x-8 items-center">
              <li>
                <a href="#home" className="text-gray-700 hover:text-blue-600 font-medium transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-blue-600 after:transition-all">
                  Home
                </a>
              </li>
              <li>
                <a href="#features" className="text-gray-700 hover:text-blue-600 font-medium transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-blue-600 after:transition-all">
                  Features
                </a>
              </li>
              <li>
                <a href="#contact" className="text-gray-700 hover:text-blue-600 font-medium transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-blue-600 after:transition-all">
                  Contact
                </a>
              </li>
              <li>
                <Link to={'/employee/login'} className="bg-blue-600 text-white px-5 py-2 rounded-full font-medium hover:bg-blue-700 hover:shadow-md transition-all transform hover:-translate-y-0.5">
                  Employee Login
                </Link>
              </li>
            </ul>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-700 focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 py-3 px-4 animate-fadeIn">
            <ul className="space-y-3">
              <li>
                <a 
                  href="#home" 
                  className="block text-gray-700 hover:text-blue-600 font-medium transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </a>
              </li>
              <li>
                <a 
                  href="#features" 
                  className="block text-gray-700 hover:text-blue-600 font-medium transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Features
                </a>
              </li>
              <li>
                <a 
                  href="#contact" 
                  className="block text-gray-700 hover:text-blue-600 font-medium transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </a>
              </li>
              <li>
                <Link 
                  to={'/employee/login'} 
                  className="block bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Employee Login
                </Link>
              </li>
            </ul>
          </div>
        )}
      </header>
    )
  }