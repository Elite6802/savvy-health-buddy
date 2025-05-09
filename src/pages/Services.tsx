
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ServiceCard from "@/components/services/ServiceCard";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { 
  Brain, 
  FirstAid, 
  Virus, 
  Heart, 
  Baby, 
  AlertCircle 
} from "lucide-react";

const services = [
  {
    title: "Mental Health",
    description: "Get support with anxiety, depression, stress management, and other mental health concerns.",
    icon: Brain,
    category: "mental-health"
  },
  {
    title: "First Aid",
    description: "Learn about emergency first aid procedures, wound care, burns treatment, and more.",
    icon: FirstAid,
    category: "first-aid"
  },
  {
    title: "COVID-19 Information",
    description: "Stay updated with the latest COVID-19 guidelines, symptoms, and preventive measures.",
    icon: Virus,
    category: "covid"
  },
  {
    title: "Sexual & Reproductive Health",
    description: "Access information about safe practices, STIs, contraception, and reproductive health.",
    icon: Heart,
    category: "sexual-health"
  },
  {
    title: "Child & Maternal Health",
    description: "Guidance on pregnancy, childcare, infant development, and maternal wellbeing.",
    icon: Baby,
    category: "maternal-health"
  },
  {
    title: "Emergency Tips",
    description: "Critical information for emergency situations and when to seek immediate medical help.",
    icon: AlertCircle,
    category: "emergency"
  }
];

const Services = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is authenticated
    if (!loading && !user) {
      toast({
        title: "Access denied",
        description: "Please log in to access health services",
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
          <div className="animate-pulse-slow">Loading...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-24">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h1 className="text-3xl md:text-4xl font-bold text-healthmate-700 dark:text-white mb-4">
              Health Services
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Select a service category to start a conversation with our AI assistant about that specific topic.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <ServiceCard
                key={index}
                title={service.title}
                description={service.description}
                icon={service.icon}
                category={service.category}
              />
            ))}
          </div>
          
          <div className="mt-16 bg-healthmate-50 dark:bg-healthmate-700 p-6 rounded-xl border border-healthmate-100 dark:border-healthmate-600">
            <h2 className="text-xl font-bold text-healthmate-700 dark:text-white mb-4">
              Important Note
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              The information provided is for educational purposes only and should not replace professional medical advice. Always consult with a qualified healthcare provider for personalized guidance.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Services;
