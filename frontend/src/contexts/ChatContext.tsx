import React, { createContext, useContext, useState, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';

export interface Legend {
  id: string;
  name: string;
  image: string;
  description: string;
}

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'legend';
  legendId: string;
  timestamp: Date;
}

export interface Conversation {
  id: string;
  legendId: string;
  messages: Message[];
  lastUpdated: Date;
  sessionId: string;
}

interface ChatContextType {
  legends: Legend[];
  conversations: Conversation[];
  currentConversation: Conversation | null;
  selectLegend: (legendId: string) => void;
  selectConversation: (conversationId: string) => void;
  sendMessage: (content: string, overrideLegendId?: string) => Promise<void>;
  startNewConversation: (legendId: string) => void;
  isLoading: boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [legends] = useState<Legend[]>([
    {
      id: 'elon',
      name: 'Elon Musk',
      image: 'assets/images/elon.webp',
      description: 'CEO of SpaceX and Tesla, Visionary of the future.'
    },
    {
      id: 'osho',
      name: 'Osho',
      image: 'assets/images/osho.webp',
      description: 'Philosopher and spiritual teacher, known for his teachings on self-realization.'
    },
    {
      id: 'jobs',
      name: 'Steve Jobs',
      image: 'assets/images/jobs.webp',
      description: 'Co-founder of Apple, Pioneer of the personal computer revolution.'
    }
  ]);

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const selectLegend = (legendId: string) => {
    // Always create a new conversation when selecting a legend
    startNewConversation(legendId);
  };

  const startNewConversation = (legendId: string) => {
    const legend = legends.find(l => l.id === legendId);
    if (!legend) return;

    // Custom welcome messages based on legend's personality
    const welcomeMessages = {
      'elon': "Ready to talk Mars colonies, EVs, or Twitter drama?",
      'osho': "The journey of a thousand questions begins with silence. What troubles you?",
      'jobs': "Think different. What's on your mind?",
    };
    
    const welcomeMessage = welcomeMessages[legendId as keyof typeof welcomeMessages] || 
                         `Hello! I am ${legend.name}. How can I assist you today?`;

    const sessionId = uuidv4();

    const newConversation: Conversation = {
      id: `conv-${Date.now()}`,
      legendId,
      messages: [
        {
          id: `msg-${Date.now()}`,
          content: welcomeMessage,
          sender: 'legend',
          legendId,
          timestamp: new Date()
        }
      ],
      lastUpdated: new Date(),
      sessionId
    };

    setConversations(prev => [...prev, newConversation]);
    setCurrentConversation(newConversation);
  };

  const selectConversation = (conversationId: string) => {
    const conversation = conversations.find(conv => conv.id === conversationId);
    if (conversation) {
      setCurrentConversation(conversation);
    }
  };

  const sendMessage = async (content: string, overrideLegendId?: string) => {
    if (!currentConversation) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      content,
      sender: 'user',
      legendId: currentConversation.legendId,
      timestamp: new Date()
    };

    const legendId = overrideLegendId || currentConversation.legendId;
    const legend = legends.find(l => l.id === legendId);

    // Update conversation with user message first
    const updatedConversation = {
      ...currentConversation,
      messages: [...currentConversation.messages, userMessage],
      lastUpdated: new Date(),
      legendId
    };

    setConversations(prev => 
      prev.map(conv => 
        conv.id === currentConversation.id ? updatedConversation : conv
      )
    );
    setCurrentConversation(updatedConversation);
    
    // Show loading state
    setIsLoading(true);
    
    try {
      // Make API call to backend
      const response = await fetch('http://localhost:3050/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          'user_input': content,
          'session_id': currentConversation.sessionId,
          'legend': legendId
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to get response from server');
      }
      
      const data = await response.json();
      
      if (data.status_code === 0) {
        throw new Error(data.message || 'Error in AI response');
      }
      
      // Create AI response message
      const legendMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        content: data.response,
        sender: 'legend',
        legendId,
        timestamp: new Date()
      };

      // Update conversation with AI response
      const finalConversation = {
        ...updatedConversation,
        messages: [...updatedConversation.messages, legendMessage],
        lastUpdated: new Date()
      };

      setConversations(prev => 
        prev.map(conv => 
          conv.id === currentConversation.id ? finalConversation : conv
        )
      );
      setCurrentConversation(finalConversation);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get AI response",
        variant: "destructive"
      });
      
      // Add error message to the conversation
      const errorMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        content: "Sorry, I couldn't process your request. Please try again later.",
        sender: 'legend',
        legendId,
        timestamp: new Date()
      };
      
      const errorConversation = {
        ...updatedConversation,
        messages: [...updatedConversation.messages, errorMessage],
        lastUpdated: new Date()
      };
      
      setConversations(prev => 
        prev.map(conv => 
          conv.id === currentConversation.id ? errorConversation : conv
        )
      );
      setCurrentConversation(errorConversation);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    legends,
    conversations,
    currentConversation,
    selectLegend,
    selectConversation,
    sendMessage,
    startNewConversation,
    isLoading
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
