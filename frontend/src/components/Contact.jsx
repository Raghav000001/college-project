 import { useState } from "react"
 import axios from "axios"
  
 export const Contact = () => { 
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      message: ''
    })
  
    const handleChange = (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      })
    }
  
    const handleSubmit = async (e) => {
      e.preventDefault()
      try {
        const response=await fetch("http://localhost:3000/contact",{
          method:"POST",
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify(formData)
        })
        if(response.ok){
          console.log("message sent");
        }else{
          console.log("message not sent");
        }
    } catch (error) {
        console.log(error,"error fetching queries");
        
      }
           

      // Reset form
      setFormData({ name: '', email: '', message: '' })
    }
  
    return (
      <section id="contact" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">Contact Us</h2>
            <p className="text-lg text-gray-600">Have questions? We're here to help!</p>
          </div>
          
          <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
            <div className="mb-6">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="mb-6">
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="mb-6">
              <textarea
                name="message"
                placeholder="Your Message"
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-40 resize-none"
              ></textarea>
            </div>
            <button 
              type="submit" 
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>
    )
  }
  