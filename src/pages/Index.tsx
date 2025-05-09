
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <Hero />
        <Features />
        
        {/* Call to Action */}
        <section className="py-16 bg-healthmate-400 dark:bg-healthmate-600">
          <div className="container-custom text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to take control of your health?
            </h2>
            <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
              Join thousands of users who use HealthMate AI for reliable health guidance and support.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/signup">
                <Button size="lg" className="bg-white text-healthmate-400 hover:bg-gray-100">
                  Get Started for Free
                </Button>
              </Link>
              <Link to="/services">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                  Explore Services
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        {/* Testimonials */}
        <section className="py-20 bg-white dark:bg-healthmate-800">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-healthmate-700 dark:text-white mb-4">
                What Our Users Say
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                HealthMate AI has helped thousands of people get reliable health information and support.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  quote: "HealthMate AI helped me understand my symptoms when I was anxious in the middle of the night.",
                  author: "Sarah K.",
                  role: "Parent of two"
                },
                {
                  quote: "The accessibility features make it easy for me to get health information despite my visual impairment.",
                  author: "Michael T.",
                  role: "Retired teacher"
                },
                {
                  quote: "I use HealthMate to learn more about managing my chronic condition. It's been invaluable.",
                  author: "Priya N.",
                  role: "Healthcare worker"
                }
              ].map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-gray-50 dark:bg-healthmate-700 p-6 rounded-xl shadow-sm relative card-hover"
                >
                  <div className="absolute -top-4 -left-4 w-8 h-8 bg-healthmate-100 dark:bg-healthmate-600 rounded-full flex items-center justify-center">
                    <span className="text-2xl text-healthmate-400">"</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 pt-2">
                    {testimonial.quote}
                  </p>
                  <div>
                    <p className="font-medium text-healthmate-700 dark:text-white">
                      {testimonial.author}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
