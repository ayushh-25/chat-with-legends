
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useChatContext } from '../contexts/ChatContext';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

const Index = () => {
  const { legends, selectLegend } = useChatContext();
  const navigate = useNavigate();

  const handleSelectLegend = (legendId: string) => {
    selectLegend(legendId);
    navigate('/chat');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-legend-light-purple to-white">
      <div className="container max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 text-legend-dark">
          Chat with Legends
        </h1>
        
        <p className="text-lg text-center max-w-2xl mx-auto mb-12 text-gray-700">
          Select a legendary figure below and start a conversation. Dive into their wisdom, stories, and perspectives.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {legends.map((legend) => (
            <Card 
              key={legend.id}
              onClick={() => handleSelectLegend(legend.id)}
              className="cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-fade-in"
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={legend.image} 
                  alt={legend.name}
                  className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
                />
              </div>
              <CardContent className="p-5">
                <h2 className="text-xl font-semibold text-legend-dark mb-2">{legend.name}</h2>
                <p className="text-gray-600 mb-4">{legend.description}</p>
                <div className="flex justify-end">
                  <span className="inline-flex items-center text-legend-purple font-medium">
                    Chat now <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
