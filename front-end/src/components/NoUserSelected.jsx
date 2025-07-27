import React from 'react'
import { FiMessageCircle } from 'react-icons/fi';

const NoUserSelected = () => {
  return (
    <div className="flex-1 flex items-center justify-center bg-slate-300">
      <div className="text-center text-gray-500">
        <FiMessageCircle size={80} className="mx-auto mb-4 opacity-70" />
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          No Conversation Selected
        </h2>
        <p className="text-sm text-gray-500">
          Select a user on the left to start a chat.
        </p>
      </div>
    </div>
  );
};

export default NoUserSelected;


