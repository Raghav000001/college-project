export  const Footer = () => {
    return (
      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-blue-400 mb-4">Admin Portal</h3>
              <p className="text-gray-300">Your complete solution for administrative management.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-blue-400 mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#home" className="text-gray-300 hover:text-blue-400 transition-colors">Home</a></li>
                <li><a href="#features" className="text-gray-300 hover:text-blue-400 transition-colors">Features</a></li>
                <li><a href="#contact" className="text-gray-300 hover:text-blue-400 transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-blue-400 mb-4">Connect With Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition-colors">FB</a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition-colors">TW</a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition-colors">IG</a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-400">
            <p>&copy; 2023 Admin Portal. All rights reserved.</p>
          </div>
        </div>
      </footer>
    )
  }