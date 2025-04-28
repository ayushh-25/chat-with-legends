
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User } from 'lucide-react';
import { useChatContext } from '@/contexts/ChatContext';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from 'sonner';

const ChatHeader = () => {
  const { currentConversation, legends, selectLegend } = useChatContext();
  const navigate = useNavigate();

  const currentLegend = legends.find(
    (legend) => legend.id === currentConversation?.legendId
  );

  const handleLegendChange = (legendId: string) => {
    selectLegend(legendId);
    toast(`Now chatting with ${legends.find(l => l.id === legendId)?.name}`);
  };

  return (
    <div className="flex items-center justify-between bg-scifi-dark p-3 border-b border-scifi-primary">
      <div className="flex items-center flex-1">
        <Button 
          variant="ghost" 
          size="icon"
          className="md:hidden mr-2 text-scifi-primary hover:text-scifi-primary/80"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        {currentLegend && (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full overflow-hidden mr-3 border border-scifi-primary">
                <img
                  src={currentLegend.image}
                  alt={currentLegend.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h2 className="font-semibold text-scifi-primary">
                  {currentLegend.name}
                </h2>
                <p className="text-xs text-scifi-light">
                  {currentConversation?.messages.length} messages
                </p>
              </div>
            </div>
            <Select
              value={currentLegend.id}
              onValueChange={handleLegendChange}
            >
              <SelectTrigger className="w-[180px] bg-scifi-dark border-scifi-primary text-scifi-primary">
                <SelectValue placeholder="Switch Legend" />
              </SelectTrigger>
              <SelectContent className="bg-scifi-dark border-scifi-primary">
                {legends.map((legend) => (
                  <SelectItem
                    key={legend.id}
                    value={legend.id}
                    className="text-scifi-primary hover:bg-scifi-accent/20"
                  >
                    {legend.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatHeader;

