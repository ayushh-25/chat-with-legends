
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useChatContext } from '@/contexts/ChatContext';
import { cn } from '@/lib/utils';

const ChatSidebar = () => {
  const { conversations, legends, selectConversation, currentConversation, startNewConversation } = useChatContext();
  const navigate = useNavigate();

  const handleNewChat = () => {
    navigate('/');
  };

  return (
    <div className="h-full flex flex-col bg-background border-r">
      <div className="p-3 flex items-center justify-between">
        <Button
          onClick={() => navigate('/')}
          variant="ghost"
          className="flex items-center text-sm font-medium"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Legends
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleNewChat}
          className="text-xs"
        >
          New Chat
        </Button>
      </div>
      
      <Separator />
      
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-2">
          {conversations.length === 0 ? (
            <p className="text-center text-muted-foreground text-sm p-4">
              No conversations yet
            </p>
          ) : (
            conversations
              .slice()
              .sort((a, b) => b.lastUpdated.getTime() - a.lastUpdated.getTime())
              .map((conversation) => {
                const legend = legends.find(l => l.id === conversation.legendId);
                const lastMessage = conversation.messages[conversation.messages.length - 1];
                
                return (
                  <div
                    key={conversation.id}
                    className={cn(
                      "flex items-center p-2 rounded-md cursor-pointer hover:bg-accent transition-colors",
                      currentConversation?.id === conversation.id && "bg-accent"
                    )}
                    onClick={() => selectConversation(conversation.id)}
                  >
                    <div className="h-10 w-10 rounded-full overflow-hidden mr-3 shrink-0">
                      {legend ? (
                        <img
                          src={legend.image}
                          alt={legend.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-muted">
                          <User className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm truncate text-foreground">
                        {legend?.name || "Unknown Legend"}
                      </h3>
                      <p className="text-xs text-muted-foreground truncate">
                        {lastMessage?.content.substring(0, 30) || "No messages"}
                        {lastMessage?.content.length > 30 ? "..." : ""}
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground ml-2">
                      {conversation.lastUpdated.toLocaleDateString()}
                    </div>
                  </div>
                );
              })
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ChatSidebar;
