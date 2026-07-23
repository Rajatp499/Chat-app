// src/pages/Home.jsx
import React from 'react';
import Navbar from '../components/Navbar';
import { Link } from 'react-router';
import { useSelector } from 'react-redux';

const Home = () => {
  const user = useSelector(state => state.user);

  return (
    <>
      <Navbar />
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 px-6">
        <div className="max-w-xl w-full text-center">
          {/* Signature element: a stacked chat-bubble mark */}
          <div className="mx-auto mb-6 w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200 rotate-3">
            <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-white -rotate-3">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
                stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-2">
            Welcome{user?.name ? `, ${user.name}` : ''}
          </h2>

          {user?.name ? (
            <>
              <p className="text-slate-500 mb-8">
                Your conversations are one click away.
              </p>
              <Link
                to="/chat"
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 rounded-full shadow-md shadow-indigo-200 transition-colors"
              >
                Start chatting
                <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </>
          ) : (
            <>
              <p className="text-slate-500 mb-8">
                Sign in to pick up where you left off.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-medium px-6 py-3 rounded-full shadow-md transition-colors"
              >
                Log in to chat
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;