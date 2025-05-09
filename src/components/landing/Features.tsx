
import { 
  MessageCircle, 
  Shield, 
  BookOpen, 
  Accessibility, 
  Clock, 
  Lock
} from "lucide-react";

const features = [
  {
    icon: MessageCircle,
    title: "AI-Powered Chat",
    description: "Get instant answers to your health questions from our advanced AI assistant."
  },
  {
    icon: Shield,
    title: "Trusted Information",
    description: "All information is based on reliable medical sources and up-to-date research."
  },
  {
    icon: BookOpen,
    title: "Health Education",
    description: "Learn about various health topics with easy-to-understand explanations."
  },
  {
    icon: Accessibility,
    title: "Accessibility Options",
    description: "Voice input/output and customizable interface for all users."
  },
  {
    icon: Clock,
    title: "Available 24/7",
    description: "Access health guidance anytime, day or night, whenever you need it."
  },
  {
    icon: Lock,
    title: "Privacy Focused",
    description: "Your health data is encrypted and never shared with third parties."
  }
];

const Features = () => {
  return (
    <section className="py-20 bg-white dark:bg-healthmate-800">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-healthmate-700 dark:text-white mb-4">
            Comprehensive Health Support
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            HealthMate AI offers a range of features to help you manage your health with confidence and ease.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-gray-50 dark:bg-healthmate-700 p-6 rounded-xl shadow-sm card-hover"
            >
              <div className="w-12 h-12 bg-healthmate-100 dark:bg-healthmate-600 rounded-full flex items-center justify-center mb-5">
                <feature.icon className="w-6 h-6 text-healthmate-400" />
              </div>
              <h3 className="text-xl font-bold text-healthmate-700 dark:text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
