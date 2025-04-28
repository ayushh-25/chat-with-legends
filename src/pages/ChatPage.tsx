
import React from 'react';
import ChatHeader from '@/components/chat/ChatHeader';
import ChatSidebar from '@/components/chat/ChatSidebar';
import ChatMessages from '@/components/chat/ChatMessages';
import ChatInput from '@/components/chat/ChatInput';
import { useIsMobile } from '@/hooks/use-mobile';
import { useChatContext } from '@/contexts/ChatContext';
import { Navigate } from 'react-router-dom';

const ChatPage = () => {
  const { currentConversation } = useChatContext();
  const isMobile = useIsMobile();

  // Redirect to home if no conversation is selected
  if (!currentConversation) {
    return <Navigate to="/" />;
  }

  return (
    <div className="h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Sidebar - Hidden on mobile when in chat view */}
      <div className={`${isMobile ? 'hidden' : 'w-80'} border-r`}>
        <ChatSidebar />
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <ChatHeader />
        <ChatMessages />
        <ChatInput />
      </div>
    </div>
  );
};

export default ChatPage;
