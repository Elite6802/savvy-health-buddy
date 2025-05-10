
import React, { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from '@/lib/supabase';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
};

interface ChatInterfaceProps {
  category?: string;
}

const ChatInterface = ({ category = "general" }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Simulate initial AI message when chat starts
  useEffect(() => {
    const initialMessage = {
      id: "welcome",
      text: `Hello! I'm your HealthMate AI assistant. How can I help you with ${category === "general" ? "your health questions" : category.replace('-', ' ') + " related questions"}?`,
      sender: "ai",
      timestamp: new Date(),
    };
    
    setMessages([initialMessage]);
  }, [category]);

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message
    const userMessageId = Date.now().toString();
    const userMessage: Message = {
      id: userMessageId,
      text: input,
      sender: "user",
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    
    // Simulate AI typing
    setIsTyping(true);
    
    try {
      // Call our AI function using Supabase Edge Function
      // Note: This is a placeholder until we create the actual edge function
      const { data, error } = await supabase.functions.invoke('chat-gpt', {
        body: {
          prompt: input,
          category: category,
        }
      });
      
      if (error) throw error;
      
      // Add AI response
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data?.generatedText || "I'm sorry, I couldn't process your request at this time.",
        sender: "ai",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error calling AI:', error);
      
      // Fallback message if the API call fails
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm having trouble connecting to my knowledge base right now. Please try again in a moment.",
        sender: "ai",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, fallbackMessage]);
      
      toast({
        title: "Connection error",
        description: "Could not connect to the AI service. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsTyping(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-healthmate-800 rounded-xl shadow-md overflow-hidden">
      {/* Chat Header */}
      <div className="bg-white dark:bg-healthmate-700 px-6 py-4 border-b border-gray-200 dark:border-healthmate-600">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-healthmate-400 flex items-center justify-center">
            <span className="text-white font-bold text-lg">H</span>
          </div>
          <div className="ml-3">
            <h3 className="font-medium text-healthmate-700 dark:text-white">
              {category === "general" ? "HealthMate AI" : `HealthMate AI - ${category.replace('-', ' ')}`}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {isTyping ? "Typing..." : "Online"}
            </p>
          </div>
        </div>
      </div>
      
      {/* Chat Messages */}
      <div className="flex-grow overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] sm:max-w-[70%] rounded-2xl px-4 py-3 ${
                message.sender === "user"
                  ? "bg-healthmate-400 text-white rounded-tr-none"
                  : "bg-white dark:bg-healthmate-700 text-gray-800 dark:text-white rounded-tl-none shadow-sm"
              }`}
            >
              <p className="text-sm sm:text-base">{message.text}</p>
              <span
                className={`text-xs mt-1 block ${
                  message.sender === "user"
                    ? "text-healthmate-100"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {formatTime(message.timestamp)}
              </span>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-healthmate-700 rounded-2xl rounded-tl-none p-4 shadow-sm max-w-[70%]">
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-healthmate-300 animate-pulse"></div>
                <div className="w-2 h-2 rounded-full bg-healthmate-300 animate-pulse delay-150"></div>
                <div className="w-2 h-2 rounded-full bg-healthmate-300 animate-pulse delay-300"></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Chat Input */}
      <div className="bg-white dark:bg-healthmate-700 px-4 py-3 border-t border-gray-200 dark:border-healthmate-600">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <Input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow"
          />
          <Button type="submit" size="icon" className="bg-healthmate-400 hover:bg-healthmate-500">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
