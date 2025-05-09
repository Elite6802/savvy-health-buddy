
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import useSupabase from "@/hooks/useSupabase";
import { ChatSession } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { MessageSquare, Plus } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const DashboardChatList = () => {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { chatSessions: chatSessionsApi } = useSupabase();
  
  useEffect(() => {
    const fetchChatSessions = async () => {
      if (user?.id) {
        try {
          setIsLoading(true);
          const { data, error } = await chatSessionsApi.getAll();
          
          if (error) throw error;
          
          if (data) {
            setChatSessions(data.slice(0, 5)); // Get only the 5 most recent
          }
        } catch (error) {
          console.error("Error fetching chat sessions:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    fetchChatSessions();
  }, [user?.id, chatSessionsApi]);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-5 bg-gray-200 dark:bg-healthmate-600 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 dark:bg-healthmate-600 rounded w-1/2 mt-2"></div>
            </CardHeader>
            <CardFooter className="pt-2">
              <div className="h-4 bg-gray-200 dark:bg-healthmate-600 rounded w-1/4"></div>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }
  
  if (chatSessions.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 pb-6 text-center">
          <MessageSquare className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
            No conversations yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Start chatting with HealthMate AI to get personalized health guidance
          </p>
          <Link to="/chat">
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Start New Chat
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-3">
      {chatSessions.map((session) => (
        <Link key={session.id} to={`/chat?session=${session.id}`}>
          <Card className="hover:bg-gray-50 dark:hover:bg-healthmate-600/50 transition-colors">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{session.title}</CardTitle>
              <CardDescription>
                Category: {session.category.charAt(0).toUpperCase() + session.category.slice(1).replace('-', ' ')}
              </CardDescription>
            </CardHeader>
            <CardFooter className="pt-2 text-sm text-gray-500 dark:text-gray-400">
              {formatDate(session.created_at)}
            </CardFooter>
          </Card>
        </Link>
      ))}
      
      {chatSessions.length > 0 && (
        <div className="text-center mt-4">
          <Link to="/chat">
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" /> Start New Chat
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default DashboardChatList;
