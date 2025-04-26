import { Link } from "react-router-dom"

export  const Header = () => {
    return (
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="text-2xl font-bold">
            <span className="text-gray-800">Elysium</span>
            <span className="text-blue-600">Payroll</span>
          </div>
          <nav>
            <ul className="flex space-x-8">
              <li><a href="#home" className="text-gray-700 hover:text-blue-600 transition-colors">Home</a></li>
              <li><a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors">Features</a></li>
              <li><a href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors">Contact</a></li>
              <li><Link to={'/employee/login'} className="text-gray-700 hover:text-blue-600 transition-colors">login as employee</Link></li>
            </ul>
          </nav>
        </div>
      </header>
    )
  }