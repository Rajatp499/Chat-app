import React, { useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import socket from '../socket/Socket';

const UsersSidebar = ({ onSelectUser }) => {


  const user = useSelector(state => state.user)
  const [users, setUsers] = useState([])
  const [unReadChat, setUnReadChat] = useState([])

  socket.on('receive_message', (m) => {
    if (m.to === user.id) {
      setUnReadChat((prev) => {
        // Add only if not already in the list
        return prev.includes(m.from) ? prev : [...prev, m.from];
      });
    }
  });




  // console.log(user)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('http://localhost:3000/user/fetchUsers', {
          method: 'GET',
          credentials: 'include'
        });

        if (!res.ok) {
          // Manually throw an error
          throw new Error(`Request failed with status ${res.status}`);
        }
        const data = await res.json();
        setUsers(data.message);

      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };

    const unreadChat = async () => {
      try {
        const res = await fetch('http://localhost:3000/message/unreadChat', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ userId: user.id })

        });

        if (!res.ok) {
          throw new Error(`Request failed with status ${res.status}`);
        }
        const data = await res.json();
        // console.log(data.message)
        setUnReadChat(data.message)

      } catch (err) {
        console.error('Error fetching users:', err);
      }

    }


    fetchUsers()
    unreadChat();
  }, [user])

  // useEffect(()=>{
  //     console.log('io')
  // },[unReadChat])

  const [open, setOpen] = useState(true);
  return (
    <div
      className={`h-[87vh] bg-slate-100 mt-4  transition-all duration-300 ease-in-out flex flex-col rounded-r-lg ${open ? 'w-72' : 'w-20'}`}
    >

      {/* Title */}
      <div className={`p-4 border-b font-semibold text-blue-600 flex justify-between `}>
        <div> {open ? 'All Users' : null}</div>
        <button
          onClick={() => setOpen(!open)}
          className=" w-8 h-8 bg-blue-600 text-white flex items-center justify-center rounded-full shadow hover:bg-blue-700 transition"
        >
          {open ? <FaChevronLeft size={12} /> : <FaChevronRight size={12} />}
        </button>
      </div>

      {/* Users List */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-2">
        {users.length === 0 ? (
          <p className="text-gray-400 text-sm text-center">No users</p>
        ) : (
          users.map((user) => (
            <div
              key={user._id}
              onClick={() => onSelectUser(user._id)}
              className={`flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50 transition cursor-pointer ${open ? 'justify-start' : 'justify-center'
                }`}
            >
              <div className="relative">
                <img
                  src={`http://localhost:3000/${user.profile}`}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover border"
                />
                {user.status === "online" && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border border-white"></span>
                )}
              </div>

              {open && (
                <div>
                  <p className={` text-gray-800 truncate ${unReadChat.includes(user._id) ? 'font-extrabold text-md' : 'font-medium text-sm'}`}>{user.name}</p>
                  <p className={`text-xs text-gray-500 truncate ${unReadChat.includes(user._id) ? 'font-extrabold text-sm' : 'font-medium text-sm'}`}>{user.email}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UsersSidebar;
