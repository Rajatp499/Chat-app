import React from 'react'
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import socket from '../socket/Socket'
import { PiChecks } from "react-icons/pi";

// import useSocket from '../hooks/useSocket';


const ChatBox = ({ selectedUserId}) => {
  // const socket = socketfn();
// console.log(socket)
  const user = useSelector(state => state.user);

  const [messages, setMessages] = useState([]);

  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);


  const roomId = [user.id, selectedUserId].sort().join('_'); // unique room ID
  // console.log(roomId)

  useEffect(() => {

    const fetchMessages = async () => {
      const res = await fetch('http://localhost:3000/message/get-messages', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: user.id, selectedUserId })
      })
      const result = await res.json()
      const date = new Date(Date.now());

      const options = {
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      };
      const formatted = date.toLocaleDateString('en-US', options);
      result.message.map((msg) => {
        msg.fromMe = (msg.from === user.id)
        msg.time = formatted;
      })
      setMessages(result.message)
    }
    
    fetchMessages();
  }, [roomId])

  useEffect(() => {
    socket.emit('join_room', roomId);
     return () => {
    // Cleanup on unmount or room change
    socket.emit('leave_room', roomId);
  };
  }, [roomId]);

  const sendMessage = () => {
    if (!input.trim()) return;

    socket.emit('send_message', {
      roomId,
      message: {
        from: user.id,
        to: selectedUserId,
        text: input,
        time: Date.now(),
        delivered:false,
        seen:false,

      }
    });
    setInput('')
  };

  useEffect(() => {
    socket.on('receive_message', (msg) => {
      const date = new Date(Date.now());

      const options = {
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      };
      const formatted = date.toLocaleDateString('en-US', options);
      console.log('Received:', msg);

      // Add to chat messages
      msg.fromMe = msg.from === user.id;
      msg.time = formatted;
      setMessages((prev) => [...prev, msg])
    });

    return () => {
      socket.off('receive_message');
    };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="w-[60%] m-auto mt-4 flex flex-col h-[calc(100vh-100px)] rounded-lg bg-slate-200 ">
      {/* Chat Header */}
      <div className="px-6 py-4 border-b shadow-sm font-semibold text-blue-600 text-lg">
        Chat with User ID: {selectedUserId}<br />
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
        {messages
          .filter(msg =>
            (msg.from === user.id && msg.to === selectedUserId) ||
            (msg.from === selectedUserId && msg.to === user.id)
          )
          .map((msg, index) => (
            
            <div
              key={index}
              className={`flex flex-col ${msg.fromMe ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg shadow text-sm ${msg.fromMe
                  ? 'bg-blue-600 text-white rounded-br-none '
                  : 'bg-white border rounded-bl-none'
                  }`}
              >
                <p>{msg.text}</p>
                <p className="text-[10px] text-right mt-1 opacity-70">{msg.time}</p>
              </div>
              {msg.delivered && msg.fromMe && (<div><PiChecks size={15} color={`${msg.seen? 'blue': 'black'}`} /></div>)}
            </div>
          ))}
        <div ref={chatEndRef} />
      </div>

      {/* Chat Input */}
      <div className="p-4 border-t flex gap-2">
        <input
          type="text"
          className="flex-1 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;