
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
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
    <div className="flex items-center justify-between bg-background p-3 border-b border-border">
      <div className="flex items-center flex-1">
        <Button 
          variant="ghost" 
          size="icon"
          className="md:hidden mr-2"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        {currentLegend && (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full overflow-hidden mr-3 border border-border">
                <img
                  src={currentLegend.image}
                  alt={currentLegend.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">
                  {currentLegend.name}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {currentConversation?.messages.length} messages
                </p>
              </div>
            </div>
            <Select
              value={currentLegend.id}
              onValueChange={handleLegendChange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Switch Legend" />
              </SelectTrigger>
              <SelectContent>
                {legends.map((legend) => (
                  <SelectItem
                    key={legend.id}
                    value={legend.id}
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
