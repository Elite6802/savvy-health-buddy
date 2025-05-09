
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardStats from "@/components/dashboard/DashboardStats";
import DashboardChatList from "@/components/dashboard/DashboardChatList";
import useSupabase from "@/hooks/useSupabase";

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { chatSessions } = useSupabase();
  
  useEffect(() => {
    // Redirect to login if not authenticated
    if (!loading && !user) {
      toast({
        title: "Access denied",
        description: "Please log in to access your dashboard",
        variant: "destructive",
      });
      navigate("/login");
    }
  }, [user, loading, navigate, toast]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-pulse text-lg">Loading your dashboard...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-16 md:py-24 bg-gray-50 dark:bg-healthmate-800">
        <div className="container-custom">
          <h1 className="text-2xl md:text-3xl font-bold text-healthmate-700 dark:text-white mb-8">
            Welcome, {user?.name || "User"}
          </h1>
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="w-full lg:w-64 shrink-0">
              <DashboardSidebar />
            </div>
            
            {/* Main Content */}
            <div className="flex-grow">
              <DashboardStats />
              
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-healthmate-700 dark:text-white mb-4">
                  Recent Conversations
                </h2>
                <DashboardChatList />
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
