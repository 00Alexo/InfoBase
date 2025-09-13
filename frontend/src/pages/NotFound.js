import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <main className="min-h-[70vh] flex flex-col items-center justify-center bg-light p-4 z-30 relative">
      <div className="flex flex-col items-center space-y-4">
        <h1 className="bi bi-link-45deg text-6xl"></h1>
        <h1 className="text-5xl">404</h1>
        <h2 className="text-4xl font-bold text-slate-300">Oops, page not found.</h2>
        <p className="text-slate-300">
          The page you are looking for does not exist. It might have been moved or deleted.
        </p>
        <button className="bg-white text-black py-2 px-4 border rounded border-gray-300 hover:bg-gray-200">
          <Link className='no-underline text-black' to="/">
            Go back home
          </Link>
        </button>
      </div>
    </main>
  )
}