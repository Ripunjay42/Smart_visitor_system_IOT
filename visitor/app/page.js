// pages/index.js
'use client';
import { useState } from 'react';
import VisitorDetails from '@/components/VisitorDetails.js';

export default function Home() {
  const [showVisitors, setShowVisitors] = useState(false);

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white shadow-xl rounded-xl overflow-hidden">
        <div className="bg-gradient-to-r from-black to-gray-800 p-6">
          <h1 className="text-3xl font-bold text-purple-500">
            IOT End Semester Project
          </h1>
          <p className="text-blue-400 mt-2 font-semibold text-lg">Ripunjay Choudhury</p>
          <p className="text-blue-400 mt-2 font-semibold text-lg">RollNo: CSM23008</p>
          <p className="text-blue-400 mt-2 font-semibold text-lg">Third Semester</p>
          <p className="text-blue-400 mt-2 font-semibold text-lg">MCA</p>
        </div>
        
        <div className="p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Visitor Management System
          </h2>
          
          <button
            className="mb-6 px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold rounded-lg shadow-md hover:from-green-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105"
            onClick={() => setShowVisitors(!showVisitors)}
          >
            {showVisitors ? 'Hide' : 'Show'} Visitor Details
          </button>
          
          {showVisitors && <VisitorDetails />}
        </div>
      </div>
    </div>
  );
}