
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
    <div className="border-t border-scifi-primary bg-scifi-dark p-3">
      <div className="flex items-end gap-2">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="flex-1 min-h-[60px] max-h-[120px] bg-scifi-secondary border-scifi-primary text-white placeholder:text-scifi-light focus-visible:ring-scifi-primary"
          disabled={!currentConversation}
        />
        <Button 
          onClick={handleSendMessage}
          disabled={!message.trim() || !currentConversation}
          className="bg-scifi-primary hover:bg-scifi-primary/90 text-scifi-secondary"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;

