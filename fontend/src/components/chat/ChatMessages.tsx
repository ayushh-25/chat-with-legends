
import React, { useEffect, useRef, useState } from 'react';
import { useChatContext } from '@/contexts/ChatContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import { User, Volume, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const ChatMessages = () => {
  const { currentConversation, legends } = useChatContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentConversation?.messages]);

  const currentLegend = legends.find(
    (legend) => legend.id === currentConversation?.legendId
  );

  const handleTextToSpeech = async (messageId: string, text: string) => {
    // This is a placeholder - you'll need to implement the actual API call
    // to ElevenLabs with your API key
    try {
      const response = await fetch('YOUR_ELEVEN_LABS_ENDPOINT', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': 'YOUR_API_KEY',
        },
        body: JSON.stringify({
          text,
          voice_id: 'eleven_monolingual_v1', // Replace with desired voice ID
        }),
      });

      if (!response.ok) throw new Error('Failed to convert text to speech');

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      // Create audio element and store in refs
      audioRefs.current[messageId] = new Audio(audioUrl);
      audioRefs.current[messageId].addEventListener('ended', () => {
        setPlayingAudio(null);
      });

      // Play the audio
      setPlayingAudio(messageId);
      audioRefs.current[messageId].play();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to convert text to speech",
        variant: "destructive"
      });
    }
  };

  const toggleAudio = (messageId: string) => {
    if (playingAudio === messageId) {
      audioRefs.current[messageId]?.pause();
      setPlayingAudio(null);
    } else {
      // Stop any currently playing audio
      if (playingAudio && audioRefs.current[playingAudio]) {
        audioRefs.current[playingAudio].pause();
      }
      if (audioRefs.current[messageId]) {
        audioRefs.current[messageId].play();
        setPlayingAudio(messageId);
      }
    }
  };

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
                    {isLegend && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => {
                          if (audioRefs.current[message.id]) {
                            toggleAudio(message.id);
                          } else {
                            handleTextToSpeech(message.id, message.content);
                          }
                        }}
                      >
                        {playingAudio === message.id ? (
                          <VolumeX className="h-4 w-4" />
                        ) : (
                          <Volume className="h-4 w-4" />
                        )}
                      </Button>
                    )}
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
