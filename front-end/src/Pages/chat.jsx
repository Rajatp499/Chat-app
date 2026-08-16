import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import UsersSidebar from '../components/userSlide';
import NoUserSelected from '../components/NoUserSelected'
import ChatBox from '../components/chatBox';

const AVAILABLE_AI_MODELS = ['gpt-oss:120b-cloud', 'qwen:1.8b'];
const DEFAULT_AI_MODEL = AVAILABLE_AI_MODELS[0];

const Chat = () => {
  const [selectedUserId, setSelectedUserId] = useState(null)
  const [selectedModel, setSelectedModel] = useState(DEFAULT_AI_MODEL)


  return (
    <div className='bg-slate-300 h-[100vh]'>
      <Navbar />
      <div className='flex' >
          <UsersSidebar
            onSelectUser={setSelectedUserId}
          />
        {
          selectedUserId ?
            <ChatBox
              selectedUserId={selectedUserId}
              selectedModel={selectedModel}
              onSelectedModelChange={setSelectedModel}
              availableModels={AVAILABLE_AI_MODELS}
            /> :
            <NoUserSelected />
        }
      </div>
    </div>
  );
};

export default Chat;
