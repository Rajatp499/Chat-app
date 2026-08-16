// src/components/ChatBox.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import socket from '../socket/Socket';
import { PiChecks } from "react-icons/pi";
import { IoDocumentAttach, IoSend } from "react-icons/io5";
import { FaFileAlt } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import axiosInstance from '../lib/axiosInstance';
import { toast } from 'react-toastify';
import { formatTime } from '../hooks/useTimeFormatter';

const ChatBox = ({ selectedUserId, selectedModel, onSelectedModelChange, availableModels }) => {
  const user = useSelector(state => state.user);

  const [messages, setMessages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);

  const roomId = [user.id, selectedUserId].sort().join('_');

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await axiosInstance.post('/message/get-messages', {
          userId: user.id,
          selectedUserId,
        });
        data.message.forEach((msg) => {
          msg.fromMe = (msg.from === user.id);
          msg.time = formatTime(msg.time);
        });
        setMessages(data.message);
      } catch (error) {
        console.error('Failed to load messages', error);
        toast.error('Failed to load messages');
      }
    };
    fetchMessages();
  }, [roomId, selectedUserId, user.id]);

  useEffect(() => {
    socket.emit('join_room', roomId);
    return () => socket.emit('leave_room', roomId);
  }, [roomId, user.id]);

  const sendMessage = () => {
    if (selectedFiles.length === 0) {
      if (!input.trim()) return;
      socket.emit('send_message', {
        roomId,
        message: {
          from: user.id,
          to: selectedUserId,
          text: input,
          time: Date.now(),
          delivered: false,
          seen: false,
          model: selectedModel,
        }
      });
      setInput('');
    } else {
      socket.emit('send_file', {
        roomId,
        message: {
          from: user.id,
          to: selectedUserId,
          file: selectedFiles[0].name,
          time: Date.now(),
          delivered: false,
          seen: false,
          model: selectedModel,
        }
      });
      setSelectedFiles([]);
    }
  };

  useEffect(() => {
    const handleReceive = (msg) => {
      msg.fromMe = msg.from === user.id;
      msg.time = formatTime(msg.time);
      setMessages((prev) => [...prev, msg]);
    };
    socket.on('receive_message', handleReceive);
    return () => socket.off('receive_message', handleReceive);
  }, [user.id]);

  // --- AI streaming ---
  // The backend sends three events per AI reply, all sharing the same
  // streamId: "ai_stream_start" (create an empty bubble), "ai_stream_chunk"
  // (append text to it), and "ai_stream_end" (mark it as finished, replace
  // with the final full text). We match on streamId, not array index, so
  // out-of-order re-renders can't corrupt the wrong bubble.
  useEffect(() => {
    const handleStreamStart = (data) => {
      if (data.roomId !== roomId) return;
      setMessages((prev) => [
        ...prev,
        {
          _id: data.streamId,
          from: data.from,
          to: data.to,
          text: '',
          time: formatTime(Date.now()),
          fromMe: false,
          delivered: false,
          seen: false,
          streaming: true,
        },
      ]);
    };

    const handleStreamChunk = (data) => {
      if (data.roomId !== roomId) return;
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === data.streamId
            ? { ...msg, text: msg.text + data.text }
            : msg
        )
      );
    };

    const handleStreamEnd = (data) => {
      if (data.roomId !== roomId) return;
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === data.streamId
            ? { ...msg, text: data.fullText, streaming: false, delivered: true }
            : msg
        )
      );
    };

    const handleStreamError = (data) => {
      if (data.roomId !== roomId) return;
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === data.streamId
            ? { ...msg, text: msg.text || 'Something went wrong.', streaming: false, error: true }
            : msg
        )
      );
    };

    socket.on('ai_stream_start', handleStreamStart);
    socket.on('ai_stream_chunk', handleStreamChunk);
    socket.on('ai_stream_end', handleStreamEnd);
    socket.on('ai_stream_error', handleStreamError);

    return () => {
      socket.off('ai_stream_start', handleStreamStart);
      socket.off('ai_stream_chunk', handleStreamChunk);
      socket.off('ai_stream_end', handleStreamEnd);
      socket.off('ai_stream_error', handleStreamError);
    };
  }, [roomId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (selectedFiles.length === 1) {
      toast.warn('Cannot send more than 1 file at once.');
      return;
    }

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => setSelectedFiles((prev) => [...prev, reader]);
      reader.readAsDataURL(file);
    } else {
      setSelectedFiles((prev) => [...prev, file]);
    }
  };

  const visibleMessages = messages.filter(msg =>
    (msg.from === user.id && msg.to === selectedUserId) ||
    (msg.from === selectedUserId && msg.to === user.id)
  );

  return (
    <div className="flex-1 m-4 flex flex-col h-[calc(100vh-100px)] rounded-2xl bg-white shadow-sm border border-slate-200 overflow-hidden">

      {/* Chat Header */}
      <div className="px-5 py-3 border-b border-slate-100 flex items-center gap-3 bg-white">
        <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-semibold text-sm">
          {String(selectedUserId).slice(0, 2).toUpperCase()}
        </div>
        <div>
          <p className="font-semibold text-slate-800 text-sm leading-tight">Chat</p>
          <p className="text-xs text-slate-400">ID: {selectedUserId}</p>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">AI model</p>
            <p className="text-xs font-medium text-slate-700">{selectedModel}</p>
          </div>
          <label className="text-xs text-slate-500 flex flex-col gap-1">
            <span className="sr-only">Select AI model</span>
            <select
              value={selectedModel}
              onChange={(e) => onSelectedModelChange(e.target.value)}
              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              {availableModels.map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-scroll px-5 py-4 space-y-3 bg-slate-50">
        {visibleMessages.length === 0 && (
          <div className="h-full flex items-center justify-center text-slate-400 text-sm">
            No messages yet — say hello 👋
          </div>
        )}

        {visibleMessages.map((msg, index) => (
          <div
            key={msg._id ?? index}
            className={`flex flex-col ${msg.fromMe ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-md px-4 py-2 text-sm shadow-sm ${
                msg.fromMe
                  ? 'bg-indigo-600 text-white rounded-2xl rounded-br-md'
                  : 'bg-white border border-slate-200 text-slate-800 rounded-2xl rounded-bl-md'
              }`}
            >
              <p className="whitespace-pre-wrap break-words">
                {msg.text}
                {msg.streaming && (
                  <span className="inline-block w-1.5 h-4 ml-0.5 align-middle bg-slate-400 animate-pulse" />
                )}
              </p>
              <p className={`text-[10px] mt-1 text-right ${msg.fromMe ? 'text-indigo-100' : 'text-slate-400'}`}>
                {msg.streaming ? 'typing…' : msg.time}
              </p>
            </div>
            {msg.delivered && msg.fromMe && (
              <div className="mt-0.5">
                <PiChecks size={14} className={msg.seen ? 'text-indigo-500' : 'text-slate-400'} />
              </div>
            )}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Selected file previews */}
      {selectedFiles.length > 0 && (
        <div className="px-5 pt-3 flex gap-3 border-t border-slate-100">
          {selectedFiles.map((file, i) => (
            <div key={i} className="relative">
              {file instanceof FileReader ? (
                <img src={file.result} className="h-14 w-14 rounded-lg object-cover border border-slate-200" />
              ) : (
                <div className="h-14 w-44 bg-slate-100 rounded-lg flex items-center gap-2 px-3">
                  <div className="bg-indigo-500 p-1.5 rounded-full flex-shrink-0">
                    <FaFileAlt size={16} className="text-white" />
                  </div>
                  <span className="text-xs text-slate-600 truncate">
                    {file.name.length >= 18 ? file.name.slice(0, 18) + '…' : file.name}
                  </span>
                </div>
              )}
              <button
                onClick={() => setSelectedFiles(selectedFiles.filter(item => item !== file))}
                className="absolute -top-1.5 -right-1.5 h-5 w-5 flex items-center justify-center bg-slate-700 text-white rounded-full hover:bg-slate-900 transition"
              >
                <IoMdClose size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Chat Input */}
      <div className="border-t border-slate-100 p-3 flex items-center gap-2 bg-white">
        <label className="bg-slate-100 hover:bg-slate-200 flex items-center justify-center p-2.5 rounded-full text-slate-600 cursor-pointer transition flex-shrink-0">
          <input className="hidden" type="file" onChange={handleFileChange} />
          <IoDocumentAttach size={18} />
        </label>

        <input
          type="text"
          className="flex-1 px-4 py-2.5 rounded-full border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white disabled:text-slate-400"
          placeholder={selectedFiles.length === 0 ? "Type your message…" : "Can't send files and text together"}
          value={input}
          disabled={selectedFiles.length > 0}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />

        <button
          onClick={sendMessage}
          className="bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 rounded-full transition flex-shrink-0"
        >
          <IoSend size={16} />
        </button>
      </div>
    </div>
  );
};

export default ChatBox;