
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="pt-32 pb-20 bg-gradient-to-b from-white to-healthmate-50 dark:from-healthmate-800 dark:to-healthmate-700">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-healthmate-700 dark:text-white leading-tight">
              Your Personal <span className="text-healthmate-400">Health Assistant</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-lg">
              Get instant health guidance, information, and support through our AI-powered assistant. Available 24/7 for all your health questions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/signup">
                <Button size="lg" className="bg-healthmate-400 hover:bg-healthmate-500 text-white">
                  Start Chatting Now
                </Button>
              </Link>
              <Link to="/services">
                <Button variant="outline" size="lg" className="border-healthmate-400 text-healthmate-400 hover:bg-healthmate-50">
                  Explore Services
                </Button>
              </Link>
            </div>
          </div>
          <div className="md:w-1/2">
            <div className="relative">
              <div className="w-full h-72 md:h-96 bg-healthmate-200 rounded-2xl overflow-hidden shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-healthmate-300/70 to-healthmate-500/70 rounded-2xl flex items-center justify-center">
                  {/* Chat bubble illustration */}
                  <div className="relative w-4/5 h-4/5">
                    <div className="absolute bottom-0 left-0 w-3/4 h-24 bg-white dark:bg-healthmate-600 rounded-xl p-4 shadow-md">
                      <div className="flex items-start">
                        <div className="w-8 h-8 rounded-full bg-healthmate-400 flex-shrink-0"></div>
                        <div className="ml-3 space-y-1">
                          <div className="h-2 w-32 bg-gray-200 dark:bg-healthmate-500 rounded"></div>
                          <div className="h-2 w-24 bg-gray-200 dark:bg-healthmate-500 rounded"></div>
                        </div>
                      </div>
                    </div>
                    <div className="absolute top-0 right-0 w-3/4 h-24 bg-white dark:bg-healthmate-600 rounded-xl p-4 shadow-md">
                      <div className="flex items-start">
                        <div className="w-8 h-8 rounded-full bg-healthmate-700 flex-shrink-0"></div>
                        <div className="ml-3 space-y-1">
                          <div className="h-2 w-32 bg-gray-200 dark:bg-healthmate-500 rounded"></div>
                          <div className="h-2 w-40 bg-gray-200 dark:bg-healthmate-500 rounded"></div>
                        </div>
                      </div>
                    </div>
                    <div className="absolute top-1/3 left-1/4 w-1/2 h-24 bg-white dark:bg-healthmate-600 rounded-xl p-4 shadow-md transform -rotate-3">
                      <div className="flex items-start">
                        <div className="w-8 h-8 rounded-full bg-healthmate-400 flex-shrink-0"></div>
                        <div className="ml-3 space-y-1">
                          <div className="h-2 w-20 bg-gray-200 dark:bg-healthmate-500 rounded"></div>
                          <div className="h-2 w-28 bg-gray-200 dark:bg-healthmate-500 rounded"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-accent-yellow rounded-full flex items-center justify-center shadow-lg">
                <span className="font-heading font-bold text-healthmate-700">24/7</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
