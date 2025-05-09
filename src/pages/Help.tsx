
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import useSupabase from "@/hooks/useSupabase";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email("Please enter a valid email"),
  subject: z.string().min(5, {
    message: "Subject must be at least 5 characters.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
});

const faqItems = [
  {
    question: "What is HealthMate AI?",
    answer: "HealthMate AI is an intelligent health assistant that provides information and guidance on various health topics through a conversational interface. It uses advanced AI to understand your questions and deliver reliable health information."
  },
  {
    question: "Is the information provided by HealthMate AI accurate?",
    answer: "HealthMate AI provides information based on current medical knowledge and guidelines. However, it should not replace professional medical advice. Always consult with a healthcare provider for personalized guidance about your health conditions."
  },
  {
    question: "Is my health data secure?",
    answer: "Yes, we take data security very seriously. Your health data is encrypted and stored securely. We never share your personal information with third parties without your explicit consent. Please review our Privacy Policy for more details."
  },
  {
    question: "Can I use HealthMate AI in emergency situations?",
    answer: "No. HealthMate AI is not designed for emergencies. If you are experiencing a medical emergency, please call your local emergency number (such as 911 in the US) or go to the nearest emergency room immediately."
  },
  {
    question: "How do I delete my account and data?",
    answer: "You can delete your account and associated data from your profile settings. Go to Profile, scroll down to the 'Danger Zone' section, and click 'Delete Account'. This action is permanent and cannot be undone."
  },
  {
    question: "Does HealthMate AI support voice input and output?",
    answer: "Yes, HealthMate AI supports both voice input (speaking to the assistant) and voice output (having responses read aloud). You can enable these features from the accessibility options within the chat interface."
  },
  {
    question: "Can I use HealthMate AI for free?",
    answer: "Yes, basic features of HealthMate AI are available for free. We may offer premium features in the future for subscribers."
  },
  {
    question: "How do I report a problem or bug?",
    answer: "You can report problems using the contact form on this page. Please provide detailed information about the issue you're experiencing to help us address it efficiently."
  }
];

const Help = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const supabase = useSupabase();
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      
      // Submit contact form to database
      await supabase.db.insert("contactForms", {
        name: values.name,
        email: values.email,
        subject: values.subject,
        message: values.message,
        created_at: new Date().toISOString(),
      });
      
      form.reset();
      
      toast({
        title: "Message sent successfully",
        description: "We'll get back to you as soon as possible",
      });
    } catch (error) {
      console.error("Error submitting contact form:", error);
      toast({
        title: "Submission failed",
        description: "There was a problem sending your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-24">
        <div className="container-custom max-w-4xl">
          <div className="text-center mb-16">
            <h1 className="text-3xl md:text-4xl font-bold text-healthmate-700 dark:text-white mb-4">
              Help & Support
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Find answers to common questions or contact our support team for assistance.
            </p>
          </div>
          
          {/* FAQ Section */}
          <section className="mb-20">
            <h2 className="text-2xl font-bold text-healthmate-700 dark:text-white mb-6">
              Frequently Asked Questions
            </h2>
            
            <Accordion type="single" collapsible className="space-y-2">
              {faqItems.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left font-medium text-healthmate-700 dark:text-white">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 dark:text-gray-300">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
          
          {/* Contact Form */}
          <section>
            <h2 className="text-2xl font-bold text-healthmate-700 dark:text-white mb-6">
              Contact Us
            </h2>
            
            <div className="bg-white dark:bg-healthmate-700 rounded-xl shadow-md p-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="name@example.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <FormControl>
                          <Input placeholder="How can we help you?" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Please describe your question or issue in detail"
                            className="min-h-32"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button
                    type="submit"
                    className="w-full md:w-auto bg-healthmate-400 hover:bg-healthmate-500"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </Form>
            </div>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Help;
