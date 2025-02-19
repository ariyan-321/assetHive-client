import React from 'react'

export default function Notice() {
  return (
    <div className="max-w-7xl mx-auto p-6 sm:p-8 space-y-6">
      <h1 className="text-4xl font-bold text-center">Employee Notices</h1>

      {/* Notice Card 1 */}
      <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0 hover:shadow-xl transition">
        <div className="flex items-center space-x-4">
          <span className="text-4xl text-blue-500">📢</span>
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">New Update on Employee Benefits</h2>
            <p className="mt-2 text-gray-600">We have introduced new health benefits for all employees starting this month. Please check the updated policy details in the portal.</p>
          </div>
        </div>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold text-lg hover:bg-blue-700 transition">Read More</button>
      </div>

      {/* Notice Card 2 */}
      <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0 hover:shadow-xl transition">
        <div className="flex items-center space-x-4">
          <span className="text-4xl text-yellow-500">🌟</span>
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">Employee of the Month</h2>
            <p className="mt-2 text-gray-600">Congratulations to Jane Smith for being our Employee of the Month! Keep up the great work.</p>
          </div>
        </div>
        <button className="bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold text-lg hover:bg-yellow-700 transition">Celebrate</button>
      </div>

      {/* Add more cards here as needed */}
    </div>
  )
}
