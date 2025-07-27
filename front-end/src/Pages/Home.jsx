// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { Link } from 'react-router';
import { useSelector } from 'react-redux';
const Home = () => {
  const user = useSelector(state => state.user)

  return (<>
    <Navbar />
    <div className="p-6 text-center">
      <h2 className="text-4xl font-semibold mb-4">Welcome to MyApp,{user.name}</h2><br />
      {user.name?
      <>
       <p className="text-lg text-gray-700">Welcome to the chat app!!!</p>
      <Link to="/chat" className="hover:bg-blue-500 text-black px-4 py-2 rounded  transition hover:text-white">Start chatting!!</Link>
      </>:
      <>
      <p className="text-lg text-gray-700">Please <Link to='/login' className='text-blue-400 underline'>Login</Link> to chat...</p>

      </>}
     
    </div>
  </>

  );
};

export default Home;
