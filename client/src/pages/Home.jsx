import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="bg-transparent text-gray-800">
      {/* Hero Section */}
      <img src="https://ik.imagekit.io/nx2mu5rdoc/dummy/bbau-satellite-campus-tikarmafi-sultanpur-universities-F5qm5mLNwE.avif" className='h-96 w-full absolute' alt="" />
      <div className="h-96 text-gray-800 z-100 relative">
        <div className="bg-opacity-50 h-full flex flex-col justify-center items-center">
          <h1 className="text-5xl font-bold mb-4 text-blue-900">Babasaheb Bhimrao Ambedkar University Library</h1>
          <p className="text-xl mb-8 text-blue-900">Your gateway to knowledge and information.</p>
          <div className="w-full max-w-md">
            <input
              type="text"
              placeholder="Search for books, journals, and more..."
              className="w-full p-4 rounded-full text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-red-100"
            />
          </div>
        </div>
      </div>

      {/* Quick Links Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-8">Quick Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <Link to="/books" className="bg-white p-8 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
            <h3 className="text-2xl font-bold mb-2">Search Books</h3>
            <p>Explore our vast collection of books and resources.</p>
          </Link>
          <Link to="/my-issues" className="bg-white p-8 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
            <h3 className="text-2xl font-bold mb-2">My Issues</h3>
            <p>View your borrowed books and due dates.</p>
          </Link>
          <a href="#" className="bg-white p-8 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
            <h3 className="text-2xl font-bold mb-2">E-Resources</h3>
            <p>Access our digital library of e-books and journals.</p>
          </a>
        </div>
      </div>

      {/* News & Announcements Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">News & Announcements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border-l-4 border-red-500 pl-4">
              <h3 className="text-xl font-bold mb-2">New Library Timings</h3>
              <p className="text-gray-600">The library will now be open from 9 AM to 8 PM on all working days.</p>
            </div>
            <div className="border-l-4 border-red-500 pl-4">
              <h3 className="text-xl font-bold mb-2">Online Workshop on Research Skills</h3>
              <p className="text-gray-600">Join our online workshop on 25th October to enhance your research skills.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 Babasaheb Bhimrao Ambedkar University. All rights reserved.</p>
          <p>Contact us: library@bbau.ac.in</p>
        </div>
      </footer>
    </div>
  );
}