
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
  legendId?: string;
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
  sendMessage: (content: string) => void;
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
      id: 'socrates',
      name: 'Socrates',
      image: 'https://images.unsplash.com/photo-1577083552762-4402a3352fe1',
      description: 'Ancient Greek philosopher known for his wisdom and the Socratic method'
    },
    {
      id: 'einstein',
      name: 'Albert Einstein',
      image: 'https://images.unsplash.com/photo-1618506469810-282bef2b30b3',
      description: 'Theoretical physicist who developed the theory of relativity'
    },
    {
      id: 'cleopatra',
      name: 'Cleopatra',
      image: 'https://images.unsplash.com/photo-1524013123088-c19c6cbfcc65',
      description: 'Last active ruler of the Ptolemaic Kingdom of Egypt'
    }
  ]);

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);

  const selectLegend = (legendId: string) => {
    // Find existing conversation with this legend or create a new one
    const existingConvo = conversations.find(conv => conv.legendId === legendId);
    if (existingConvo) {
      setCurrentConversation(existingConvo);
    } else {
      startNewConversation(legendId);
    }
  };

  const selectConversation = (conversationId: string) => {
    const conversation = conversations.find(conv => conv.id === conversationId);
    if (conversation) {
      setCurrentConversation(conversation);
    }
  };

  const startNewConversation = (legendId: string) => {
    const legend = legends.find(l => l.id === legendId);
    if (!legend) return;

    const newConversation: Conversation = {
      id: `conv-${Date.now()}`,
      legendId,
      messages: [
        {
          id: `msg-${Date.now()}`,
          content: `Hello! I am ${legend.name}. How can I assist you today?`,
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

  const sendMessage = (content: string) => {
    if (!currentConversation) return;

    // User message
    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      content,
      sender: 'user',
      timestamp: new Date()
    };

    // Simulate legend response after user message
    const legend = legends.find(l => l.id === currentConversation.legendId);
    const legendMessage: Message = {
      id: `msg-${Date.now() + 1}`,
      content: `${legend?.name} response to: "${content}"`,
      sender: 'legend',
      legendId: currentConversation.legendId,
      timestamp: new Date()
    };

    const updatedConversation = {
      ...currentConversation,
      messages: [...currentConversation.messages, userMessage, legendMessage],
      lastUpdated: new Date()
    };

    setConversations(prev => 
      prev.map(conv => conv.id === currentConversation.id ? updatedConversation : conv)
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
