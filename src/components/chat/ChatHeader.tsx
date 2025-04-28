
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User } from 'lucide-react';
import { useChatContext } from '@/contexts/ChatContext';
import { Button } from '@/components/ui/button';

const ChatHeader = () => {
  const { currentConversation, legends } = useChatContext();
  const navigate = useNavigate();

  const currentLegend = legends.find(
    (legend) => legend.id === currentConversation?.legendId
  );

  return (
    <div className="flex items-center justify-between bg-white shadow-sm p-3 border-b">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="icon"
          className="md:hidden mr-2"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        {currentLegend && (
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
              <img
                src={currentLegend.image}
                alt={currentLegend.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <h2 className="font-semibold text-legend-dark">
                {currentLegend.name}
              </h2>
              <p className="text-xs text-gray-500">
                {currentConversation?.messages.length} messages
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatHeader;
