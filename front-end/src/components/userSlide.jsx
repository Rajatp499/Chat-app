// src/components/UsersSidebar.jsx
import React, { useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import socket from '../socket/Socket';
import axiosInstance from '../lib/axiosInstance';
import { toast } from 'react-toastify';

const UsersSidebar = ({ onSelectUser }) => {
  const user = useSelector(state => state.user);
  const [users, setUsers] = useState([]);
  const [unReadChat, setUnReadChat] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const handleReceive = (m) => {
      if (m.to === user.id) {
        setUnReadChat((prev) => (prev.includes(m.from) ? prev : [...prev, m.from]));
      }
    };
    socket.on('receive_message', handleReceive);
    return () => socket.off('receive_message', handleReceive);
  }, [user]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axiosInstance.get('/user/fetchUsers');
        setUsers(data.message);
      } catch (err) {
        console.error('Error fetching users:', err);
        toast.error('Failed to load users');
      }
    };

    const unreadChat = async () => {
      try {
        const { data } = await axiosInstance.post('/message/unreadChat', { userId: user.id });
        setUnReadChat(data.message);
      } catch (err) {
        console.error('Error fetching users:', err);
        toast.error('Failed to load unread chats');
      }
    };

    fetchUsers();
    unreadChat();
  }, [user]);

  const handleSelect = (id) => {
    setActiveId(id);
    setUnReadChat((prev) => prev.filter((uid) => uid !== id));
    onSelectUser(id);
  };

  return (
    <div
      className={`h-full bg-white m-4 mr-0 border border-slate-200 transition-all duration-300 ease-in-out flex flex-col rounded-2xl shadow-sm ${
        open ? 'w-72' : 'w-20'
      }`}
    >
      {/* Title */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        {open && <p className="font-semibold text-slate-800 text-sm">Conversations</p>}
        <button
          onClick={() => setOpen(!open)}
          className="w-8 h-8 bg-indigo-600 text-white flex items-center justify-center rounded-full shadow hover:bg-indigo-700 transition flex-shrink-0"
        >
          {open ? <FaChevronLeft size={12} /> : <FaChevronRight size={12} />}
        </button>
      </div>

      {/* Users List */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
        {users.length === 0 ? (
          <p className="text-slate-400 text-sm text-center mt-4">No users</p>
        ) : (
          users.map((u) => {
            const unread = unReadChat.includes(u._id);
            const active = activeId === u._id;
            return (
              <div
                key={u._id}
                onClick={() => handleSelect(u._id)}
                className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer transition ${
                  active ? 'bg-indigo-50' : 'hover:bg-slate-50'
                } ${open ? 'justify-start' : 'justify-center'}`}
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={`http://localhost:3000/${u.profile}`}
                    alt={u.name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
                  />
                  {u.status === "online" && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
                  )}
                  {unread && !open && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-600 rounded-full border-2 border-white" />
                  )}
                </div>

                {open && (
                  <div className="min-w-0 flex-1 flex items-center justify-between">
                    <div className="min-w-0">
                      <p className={`text-sm truncate ${unread ? 'font-semibold text-slate-900' : 'font-medium text-slate-700'}`}>
                        {u.name}
                      </p>
                      <p className="text-xs text-slate-400 truncate">{u.email}</p>
                    </div>
                    {unread && (
                      <span className="w-2 h-2 rounded-full bg-indigo-600 flex-shrink-0 ml-2" />
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default UsersSidebar;