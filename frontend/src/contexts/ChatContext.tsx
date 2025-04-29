import React, { createContext, useContext, useState, ReactNode } from 'react';

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
}

interface ChatContextType {
  legends: Legend[];
  conversations: Conversation[];
  currentConversation: Conversation | null;
  selectLegend: (legendId: string) => void;
  selectConversation: (conversationId: string) => void;
  sendMessage: (content: string, overrideLegendId?: string) => void;
  startNewConversation: (legendId: string) => void;
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

  const selectLegend = (legendId: string) => {
    if (currentConversation) {
      const updatedConversation = {
        ...currentConversation,
        legendId
      };
      setCurrentConversation(updatedConversation);
      setConversations(prev => 
        prev.map(conv => 
          conv.id === currentConversation.id ? updatedConversation : conv
        )
      );
      
      const switchMessage: Message = {
        id: `msg-${Date.now()}`,
        content: `Chat continued with ${legends.find(l => l.id === legendId)?.name}`,
        sender: 'legend',
        legendId,
        timestamp: new Date()
      };
      
      sendMessage(switchMessage.content, legendId);
    } else {
      startNewConversation(legendId);
    }
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
      lastUpdated: new Date()
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

  const sendMessage = (content: string, overrideLegendId?: string) => {
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
    
    const legendMessage: Message = {
      id: `msg-${Date.now() + 1}`,
      content: `${legend?.name} response to: "${content}"`,
      sender: 'legend',
      legendId,
      timestamp: new Date()
    };

    const updatedConversation = {
      ...currentConversation,
      messages: [...currentConversation.messages, userMessage, legendMessage],
      lastUpdated: new Date(),
      legendId
    };

    setConversations(prev => 
      prev.map(conv => 
        conv.id === currentConversation.id ? updatedConversation : conv
      )
    );
    setCurrentConversation(updatedConversation);
  };

  const value = {
    legends,
    conversations,
    currentConversation,
    selectLegend,
    selectConversation,
    sendMessage,
    startNewConversation
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
