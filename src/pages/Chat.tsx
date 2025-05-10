
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ChatInterface from "@/components/chat/ChatInterface";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Mic, 
  Volume2,
  Volume, 
  XCircle, 
  Check,
  ArrowLeft
} from "lucide-react";

const Chat = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category") || "general";
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [voiceInput, setVoiceInput] = useState(false);
  const [voiceOutput, setVoiceOutput] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showAccessibilityMenu, setShowAccessibilityMenu] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    if (!loading && !user) {
      toast({
        title: "Access denied",
        description: "Please log in to access the chat",
        variant: "destructive",
      });
      navigate("/login");
    }
  }, [user, loading, navigate, toast]);

  const toggleVoiceInput = () => {
    // This would integrate with the browser's Speech Recognition API
    setVoiceInput(!voiceInput);
    toast({
      title: `Voice input ${!voiceInput ? "enabled" : "disabled"}`,
      description: !voiceInput 
        ? "You can now speak to send messages" 
        : "Voice input has been turned off",
    });
  };

  const toggleVoiceOutput = () => {
    // This would integrate with the browser's Speech Synthesis API
    setVoiceOutput(!voiceOutput);
    toast({
      title: `Voice output ${!voiceOutput ? "enabled" : "disabled"}`,
      description: !voiceOutput 
        ? "AI responses will be read aloud" 
        : "Voice output has been turned off",
    });
  };

  const toggleRecording = () => {
    // This would integrate with the browser's Speech Recognition API
    setIsRecording(!isRecording);
    
    if (!isRecording) {
      toast({
        title: "Recording started",
        description: "Listening for your message...",
      });
    } else {
      toast({
        title: "Recording stopped",
        description: "Processing your message...",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-pulse-slow">Loading...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-24">
        <div className="container-custom h-full">
          <div className="flex flex-col h-[calc(100vh-12rem)]">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigate('/dashboard')}
                  title="Back to Dashboard"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <h1 className="text-2xl font-bold text-healthmate-700 dark:text-white">
                  {category === "general" 
                    ? "Chat with HealthMate AI" 
                    : `${category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')} Support`}
                </h1>
              </div>
              <div className="flex items-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAccessibilityMenu(!showAccessibilityMenu)}
                  className="relative"
                >
                  Accessibility
                  {showAccessibilityMenu && (
                    <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-healthmate-700 rounded-md shadow-lg p-4 z-50 border border-gray-200 dark:border-healthmate-600">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Mic className="h-4 w-4" />
                            <Label htmlFor="voice-input">Voice Input</Label>
                          </div>
                          <Switch
                            id="voice-input"
                            checked={voiceInput}
                            onCheckedChange={toggleVoiceInput}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Volume2 className="h-4 w-4" />
                            <Label htmlFor="voice-output">Voice Output</Label>
                          </div>
                          <Switch
                            id="voice-output"
                            checked={voiceOutput}
                            onCheckedChange={toggleVoiceOutput}
                          />
                        </div>
                        
                        <div className="pt-2 border-t border-gray-200 dark:border-healthmate-600">
                          <Button
                            variant="default"
                            size="sm"
                            className="w-full"
                            onClick={() => setShowAccessibilityMenu(false)}
                          >
                            Close
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </Button>
                
                {voiceInput && (
                  <Button
                    variant={isRecording ? "destructive" : "outline"}
                    size="icon"
                    className="ml-2"
                    onClick={toggleRecording}
                  >
                    {isRecording ? <XCircle className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                )}
                
                {voiceOutput && (
                  <Button
                    variant={voiceOutput ? "default" : "outline"}
                    size="icon"
                    className="ml-2"
                    onClick={toggleVoiceOutput}
                  >
                    {voiceOutput ? <Volume className="h-4 w-4" /> : <Volume className="h-4 w-4" />}
                  </Button>
                )}
              </div>
            </div>
            
            <div className="flex-grow">
              <ChatInterface category={category} />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Chat;
