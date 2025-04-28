
import React, { useEffect, useRef } from 'react';
import { useChatContext } from '@/contexts/ChatContext';
import { Avatar } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { User } from 'lucide-react';

const ChatMessages = () => {
  const { currentConversation, legends } = useChatContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentConversation?.messages]);

  const currentLegend = legends.find(
    (legend) => legend.id === currentConversation?.legendId
  );

  if (!currentConversation) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Select or start a conversation</p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-4">
        {currentConversation.messages.map((message) => {
          const isLegend = message.sender === 'legend';
          
          return (
            <div
              key={message.id}
              className={`flex ${isLegend ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`flex ${isLegend ? 'flex-row' : 'flex-row-reverse'} max-w-[80%]`}
              >
                <div className={`flex items-end ${isLegend ? 'mr-2' : 'ml-2'}`}>
                  <div className="h-8 w-8 rounded-full overflow-hidden">
                    {isLegend && currentLegend ? (
                      <img
                        src={currentLegend.image}
                        alt={currentLegend.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-blue-500 text-white">
                        <User className="h-5 w-5" />
                      </div>
                    )}
                  </div>
                </div>
                <div
                  className={`rounded-lg px-4 py-2 ${
                    isLegend
                      ? 'bg-white border'
                      : 'bg-legend-purple text-white'
                  }`}
                >
                  <div className={`text-xs mb-1 ${isLegend ? 'text-legend-dark' : 'text-white'}`}>
                    {isLegend ? currentLegend?.name || 'Legend' : 'You'}
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <div className="text-xs mt-1 opacity-70">
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
};

export default ChatMessages;
