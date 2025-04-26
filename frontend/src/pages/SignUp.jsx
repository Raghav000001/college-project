import React, { useState } from 'react';
import { FaGoogle, FaEyeSlash, FaEye } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export const SignUp = () => {
    const [formData, setformData] = useState({
        fullName: "",
        email: "",
        password: "",
    });
    
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();  
        try {
            const response = await fetch("http://localhost:3000/sign-up", {
              method: "POST",
              body: JSON.stringify(formData),
              headers: {
                "Content-Type": "application/json"
              }
            });
            const data = await response.json();
            if (response.ok) {
             alert("account created successfully");
               setformData({
               fullName: '',
               email: '',
               password: ''
             });
            } else {
             alert("error saving the data");
            }
          } catch (error) {
           console.log(error, "error while saving the data");      
          }     
    }


    
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 to-indigo-600 p-2 sm:p-4 md:p-6">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-xs sm:max-w-sm md:max-w-md p-4 sm:p-6 md:p-8 animate-fade-in-up">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Create Account</h2>
          <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">Join us today and get started</p>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Full Name
            </label>
            <input
              onChange={(e) => setformData({...formData, fullName: e.target.value})}
              value={formData.fullName}
              type="text"
              id="fullName"
              placeholder="Enter your full name"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-sm sm:text-base"
            />
          </div>
          
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Email Address
            </label>
            <input
              onChange={(e) => setformData({...formData, email: e.target.value})}
              value={formData.email}
              type="email"
              id="email"
              placeholder="Enter your email"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-sm sm:text-base"
            />
          </div>
          
          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Password
            </label>
            <div className="relative">
              <input
                onChange={(e) => setformData({...formData, password: e.target.value})}
                value={formData.password}
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Create a strong password"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-sm sm:text-base"
              />
              <button 
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>
            <p className="mt-1 sm:mt-2 text-xs text-gray-500">Must be at least 8 characters with 1 uppercase, 1 number and 1 special character</p>
          </div>
          
          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                placeholder="Confirm your password"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-sm sm:text-base"
              />
              <button 
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>
          </div>
          
          {/* Terms and Conditions */}
          <div className="flex items-start">
            <input
              id="terms"
              type="checkbox"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mt-1"
            />
            <label  htmlFor="terms" className="ml-2 block text-xs sm:text-sm text-gray-600">
              I agree to the <a href="#" className="text-indigo-600 hover:text-indigo-800 hover:underline">Terms of Service</a> and <a href="#" className="text-indigo-600 hover:text-indigo-800 hover:underline">Privacy Policy</a>
            </label>
          </div>
          
          {/* Sign Up Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 sm:py-3 rounded-lg font-semibold hover:bg-indigo-700 transition duration-300 shadow-md text-sm sm:text-base"
          >
            Create Account
          </button>
          
          {/* Divider */}
          <div className="flex items-center my-3 sm:my-4">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="px-3 sm:px-4 text-gray-500 text-xs sm:text-sm">OR</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          

        </form>
        
        {/* Footer */}
        <div className="text-center mt-6 sm:mt-8">
          <p className="text-xs sm:text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/" className="text-indigo-600 font-semibold hover:text-indigo-800 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
