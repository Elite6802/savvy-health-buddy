
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface ServiceCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  category: string;
}

const ServiceCard = ({ title, description, icon: Icon, category }: ServiceCardProps) => {
  return (
    <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg border-gray-200 dark:border-healthmate-700">
      <CardHeader className="p-6 bg-healthmate-50 dark:bg-healthmate-700 border-b border-gray-200 dark:border-healthmate-600">
        <div className="w-12 h-12 bg-white dark:bg-healthmate-600 rounded-full shadow-sm flex items-center justify-center mb-3">
          <Icon className="w-6 h-6 text-healthmate-400" />
        </div>
        <h3 className="text-xl font-bold text-healthmate-700 dark:text-white">{title}</h3>
      </CardHeader>
      <CardContent className="p-6">
        <p className="text-gray-600 dark:text-gray-300">{description}</p>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Link to={`/chat?category=${category}`} className="w-full">
          <Button className="w-full bg-healthmate-400 hover:bg-healthmate-500 text-white">
            Start Conversation
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ServiceCard;
