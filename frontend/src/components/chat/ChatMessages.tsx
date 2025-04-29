
import React, { useEffect, useRef } from 'react';
import { useChatContext } from '@/contexts/ChatContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import { User, Loader2 } from 'lucide-react';

const ChatMessages = () => {
  const { currentConversation, legends, isLoading } = useChatContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentConversation?.messages]);

  if (!currentConversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-muted text-foreground">
        <div className="text-center">
          <p>Select or start a conversation</p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1 p-4 bg-background">
      <div className="space-y-4">
        {currentConversation.messages.map((message) => {
          const isLegend = message.sender === 'legend';
          const messageLegend = legends.find(l => l.id === message.legendId);
          
          return (
            <div
              key={message.id}
              className={`flex ${isLegend ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`flex ${isLegend ? 'flex-row' : 'flex-row-reverse'} max-w-[80%] group`}
              >
                <div className={`flex items-end ${isLegend ? 'mr-2' : 'ml-2'}`}>
                  <div className="h-8 w-8 rounded-full overflow-hidden border border-border">
                    {isLegend && messageLegend ? (
                      <img
                        src={messageLegend.image}
                        alt={messageLegend.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-primary text-primary-foreground">
                        <User className="h-5 w-5" />
                      </div>
                    )}
                  </div>
                </div>
                <div
                  className={`rounded-lg px-4 py-2 ${
                    isLegend
                      ? 'bg-muted border border-border'
                      : 'bg-primary'
                  }`}
                >
                  <div className={`text-xs mb-1 ${isLegend ? 'text-foreground' : 'text-primary-foreground'}`}>
                    {isLegend ? messageLegend?.name || 'Legend' : 'You'}
                  </div>
                  <p className={`text-sm whitespace-pre-wrap ${isLegend ? 'text-foreground' : 'text-primary-foreground'}`}>
                    {message.content}
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <span className={`text-xs opacity-70 ${isLegend ? 'text-muted-foreground' : 'text-primary-foreground/70'}`}>
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex flex-row max-w-[80%]">
              <div className="flex items-end mr-2">
                <div className="h-8 w-8 rounded-full overflow-hidden border border-border bg-muted flex items-center justify-center">
                  <Loader2 className="h-5 w-5 animate-spin text-foreground" />
                </div>
              </div>
              <div className="rounded-lg px-4 py-2 bg-muted border border-border">
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin text-foreground" />
                  <span className="text-sm text-foreground">Thinking...</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
};

export default ChatMessages;
