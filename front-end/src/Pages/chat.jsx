import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router';
import UsersSidebar from '../components/userSlide';
import NoUserSelected from '../components/NoUserSelected'
import ChatBox from '../components/chatBox';
import { useSelector } from 'react-redux';
import axiosInstance from '../lib/axiosInstance';
import { toast } from 'react-toastify';

const Chat = () => {
  const navigate = useNavigate();
  const [selectedUserId, setSelectedUserId] = useState(null)
  const user = useSelector(state => state.user)


  return (
    <div className='bg-slate-300 h-[100vh]'>
      <Navbar />
      <div className='flex' >
          <UsersSidebar
            onSelectUser={setSelectedUserId}
          />
        {
          selectedUserId ?
            <ChatBox selectedUserId={selectedUserId} /> :
            <NoUserSelected />
        }
      </div>
    </div>
  );
};

export default Chat;
