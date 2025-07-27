import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router';
import UsersSidebar from '../components/userSlide';
import NoUserSelected from '../components/NoUserSelected'
import ChatBox from '../components/chatBox';
import { useSelector } from 'react-redux';

const Chat = () => {
  const navigate = useNavigate();
  const [selectedUserId, setSelectedUserId] = useState(null)
  const user = useSelector(state => state.user)





  useEffect(() => {
    if (!user.id) return;
    const checkAuth = async () => {
      try {
        const res = await fetch('http://localhost:3000/auth/secure', {
          method: 'GET',
          credentials: 'include',
        });

        if (!res.ok) {
          navigate('/login');
        }
      } catch (error) {
        console.log('Auth check failed:', error);
        navigate('/login');
      }
    };


    

    

    checkAuth();

  }, [user]);
  // console.log(unreadChat)
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
