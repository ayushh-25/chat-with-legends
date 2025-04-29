
import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useChatContext } from '@/contexts/ChatContext';
import { Loader2 } from 'lucide-react';

const ChatInput = () => {
  const [message, setMessage] = useState('');
  const { sendMessage, currentConversation, isLoading } = useChatContext();

  const handleSendMessage = async () => {
    if (message.trim() && currentConversation && !isLoading) {
      const userMessage = message.trim();
      setMessage('');
      await sendMessage(userMessage);
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
          disabled={!currentConversation || isLoading}
        />
        <Button 
          onClick={handleSendMessage}
          disabled={!message.trim() || !currentConversation || isLoading}
        >
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;
