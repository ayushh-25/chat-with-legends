
import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useChatContext } from '@/contexts/ChatContext';

const ChatInput = () => {
  const [message, setMessage] = useState('');
  const { sendMessage, currentConversation } = useChatContext();

  const handleSendMessage = () => {
    if (message.trim() && currentConversation) {
      sendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="border-t border-border bg-background p-3">
      <div className="flex items-end gap-2">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="flex-1 min-h-[60px] max-h-[120px] bg-background border-input text-foreground placeholder:text-muted-foreground focus-visible:ring-ring"
          disabled={!currentConversation}
        />
        <Button 
          onClick={handleSendMessage}
          disabled={!message.trim() || !currentConversation}
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;
