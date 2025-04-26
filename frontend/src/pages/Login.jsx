import React from 'react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setformData] = useState({
        fullName: "",
        email: "",
        password: "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        const cleanData = {
            email: formData.email.trim(),
            password: formData.password.trim()
        };
        
        try {
           const response =await  fetch("http://localhost:3000/login",{
            method:"POST",
            body:JSON.stringify(formData),
            headers:{
                "Content-Type":"application/json"
            }
           }) 
             const data= await response.json();   
           if (response.ok) {
            alert("Login successfully");
            setformData({
                fullName: "",
                email: "",
                password: "",

            })
            navigate('/admin/dashboard')
           } else {
            alert(data.message);
           }
        } catch (error) {
            console.log(error, "error while logging in");
            throw error;
            
        }
        
    };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 to-indigo-600 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Welcome Back To Elysium</h2>
          <p className="text-gray-600 mt-2">Sign in to continue</p>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Email Input */}
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              onChange={(e) => setformData({...formData, email: e.target.value})}
              required
              type="email"
              id="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          {/* Password Input */}
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              onChange={(e) => setformData({...formData, password: e.target.value})}
              required
              type="password"
              id="password"
              placeholder="Enter your password"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          {/* Forgot Password */}
          <div className="text-right mb-6">
            <a href="#" className="text-sm text-purple-600 hover:text-purple-800 hover:underline">
              Forgot Password?
            </a>
          </div>
          
          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition duration-300 shadow-md"
          >
            Sign In
          </button>
          
          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="px-4 text-gray-500 text-sm">OR</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          

        </form>
        
        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link to={'/sign-up'} className="text-purple-600 font-semibold hover:text-purple-800 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
