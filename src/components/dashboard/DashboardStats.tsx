
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import useSupabase from "@/hooks/useSupabase";
import { MessageSquare, Calendar, Clock } from "lucide-react";

const DashboardStats = () => {
  const [totalChats, setTotalChats] = useState(0);
  const [lastActive, setLastActive] = useState<string | null>(null);
  const { chatSessions } = useSupabase();
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchStats = async () => {
      if (user?.id) {
        try {
          const { data } = await chatSessions.getAll();
          if (data) {
            setTotalChats(data.length);
            
            if (data.length > 0) {
              // Get the most recent chat session
              const mostRecent = new Date(data[0].created_at);
              setLastActive(mostRecent.toLocaleDateString());
            }
          }
        } catch (error) {
          console.error("Error fetching dashboard stats:", error);
        }
      }
    };
    
    fetchStats();
  }, [user?.id, chatSessions]);
  
  const stats = [
    {
      title: "Total Conversations",
      value: totalChats,
      icon: MessageSquare,
    },
    {
      title: "Last Active",
      value: lastActive || "Never",
      icon: Clock,
    },
    {
      title: "Member Since",
      value: user?.created_at 
        ? new Date(user.created_at).toLocaleDateString() 
        : "Today",
      icon: Calendar,
    }
  ];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat, i) => (
        <Card key={i}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400 flex gap-2 items-center">
              <stat.icon size={16} />
              {stat.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-healthmate-700 dark:text-white">
              {stat.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStats;
