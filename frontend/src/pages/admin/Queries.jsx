import React from 'react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { FaTrash, FaEnvelope, FaUser, FaCalendarAlt } from 'react-icons/fa'
import AdminHeader from './AdminHeader';

function Queries() {
    const [items, setItems] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:3000/contact")
            .then((response) => {
                setItems(response.data);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, [items])

    const handleDelete = (id) => {
        axios.delete(`http://localhost:3000/contact/${id}`)
            .then(() => {
                setItems(items.filter((item) => item.id !== id));
            })
            .catch((error) => {
                console.error('Error deleting data:', error);
            });
        console.log("Delete query with ID:", id);
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <AdminHeader />
            <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl bg-clip-text  bg-gradient-to-r from-blue-600 to-indigo-700">
                        Customer Queries Dashboard
                    </h2>
                    <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-600 sm:mt-4">
                        Manage and respond to all customer inquiries in one place
                    </p>
                </div>

                {items.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-xl shadow-lg transition-all hover:shadow-xl">
                        <FaEnvelope className="mx-auto h-16 w-16 text-blue-500 animate-pulse" />
                        <h3 className="mt-4 text-lg font-medium text-gray-900">No queries</h3>
                        <p className="mt-2 text-md text-gray-500">No customer queries have been received yet.</p>
                    </div>
                ) : (
                    <div className="bg-white shadow-lg rounded-xl overflow-hidden transition-all hover:shadow-xl">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gradient-to-r from-blue-600 to-indigo-700">
                                    <tr>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                                            <div className="flex items-center">
                                                <FaUser className="mr-2" />
                                                Name
                                            </div>
                                        </th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                                            <div className="flex items-center">
                                                <FaEnvelope className="mr-2" />
                                                Email
                                            </div>
                                        </th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                                            <div className="flex items-center">
                                                Message
                                            </div>
                                        </th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                                            <div className="flex items-center">
                                                <FaCalendarAlt className="mr-2" />
                                                Date
                                            </div>
                                        </th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {items.map((item, index) => (
                                        <tr key={item._id} className={index % 2 === 0 ? 'bg-white hover:bg-blue-50 transition-colors' : 'bg-gray-50 hover:bg-blue-50 transition-colors'}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-500">{item.email}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-500 max-w-xs truncate">{item.message}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-500">
                                                    {new Date(item.createdAt || Date.now()).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-3">

                                                    <button 
                                                        onClick={() => handleDelete(item._id)}
                                                        className="text-red-600 hover:text-red-900 transition-colors flex items-center bg-red-50 hover:bg-red-100 px-2 py-1 rounded-md"
                                                    >
                                                        <FaTrash className="mr-1" /> Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Queries