
import React, { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

// Mock AI responses for demo purposes - would be replaced with actual API calls
const mockResponses = {
  general: [
    "I'm here to help with any health questions you have. What would you like to know?",
    "That's an interesting question. Based on general health guidelines...",
    "It's important to consult with a healthcare professional for personalized advice, but here's some general information..."
  ],
  "mental-health": [
    "Mental health is just as important as physical health. How have you been feeling lately?",
    "Practicing mindfulness and regular exercise can help manage stress and anxiety.",
    "Many people experience similar challenges with their mental health. Have you considered speaking with a professional?"
  ],
  "first-aid": [
    "For minor burns, cool the area with running water for at least 10 minutes.",
    "If someone is choking, perform the Heimlich maneuver by giving abdominal thrusts.",
    "For cuts, apply direct pressure to stop bleeding, then clean with water and mild soap."
  ],
  covid: [
    "Common COVID-19 symptoms include fever, cough, and fatigue. If you're experiencing these, consider getting tested.",
    "COVID-19 vaccines are effective at preventing severe illness, hospitalization, and death.",
    "If you've been exposed to COVID-19, it's recommended to monitor for symptoms and follow local guidelines for testing."
  ],
  "sexual-health": [
    "Regular STI testing is recommended for sexually active individuals.",
    "Safe sex practices include using barrier methods like condoms to prevent STIs.",
    "It's important to communicate openly with partners about sexual health."
  ],
  "maternal-health": [
    "Prenatal vitamins with folic acid are recommended before and during pregnancy.",
    "Regular prenatal check-ups are essential for monitoring both maternal and fetal health.",
    "Breastfeeding provides important nutrients and antibodies to newborns."
  ],
  emergency: [
    "If someone is experiencing chest pain or difficulty breathing, call emergency services immediately.",
    "For suspected stroke, remember FAST: Face drooping, Arm weakness, Speech difficulties, Time to call emergency services.",
    "In case of severe bleeding, apply direct pressure and elevate the affected area while seeking emergency care."
  ]
};

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
    const categoryKey = category as keyof typeof mockResponses;
    const initialMessage = mockResponses[categoryKey]?.[0] || mockResponses.general[0];
    
    setMessages([
      {
        id: "welcome",
        text: initialMessage,
        sender: "ai",
        timestamp: new Date(),
      },
    ]);
  }, [category]);

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    
    // Simulate AI typing
    setIsTyping(true);
    
    // Simulate AI response after a delay
    setTimeout(() => {
      const categoryKey = category as keyof typeof mockResponses;
      const responsePool = mockResponses[categoryKey] || mockResponses.general;
      const randomResponse = responsePool[Math.floor(Math.random() * responsePool.length)];
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        sender: "ai",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
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
