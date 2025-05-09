
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});

const Login = () => {
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [isResetSubmitting, setIsResetSubmitting] = useState(false);
  const { toast } = useToast();
  const { signIn, resetPassword, loading } = useAuth();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await signIn(values.email, values.password);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resetEmail) {
      toast({
        title: "Email required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsResetSubmitting(true);
      await resetPassword(resetEmail);
      setShowResetForm(false);
      setResetEmail("");
      toast({
        title: "Reset email sent",
        description: "Check your inbox for password reset instructions",
      });
    } catch (error) {
      console.error("Password reset failed:", error);
      toast({
        title: "Reset failed",
        description: "There was a problem sending the reset email",
        variant: "destructive",
      });
    } finally {
      setIsResetSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center py-16 bg-gray-50 dark:bg-healthmate-800">
        <div className="w-full max-w-md p-8 bg-white dark:bg-healthmate-700 rounded-xl shadow-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-healthmate-700 dark:text-white">
              {showResetForm ? "Reset Password" : "Log in to HealthMate AI"}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              {showResetForm
                ? "Enter your email to receive reset instructions"
                : "Welcome back! Please enter your details"}
            </p>
          </div>
          
          {showResetForm ? (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="reset-email"
                  className="text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Email
                </label>
                <Input
                  id="reset-email"
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full"
                />
              </div>
              
              <Button
                type="submit"
                className="w-full bg-healthmate-400 hover:bg-healthmate-500"
                disabled={isResetSubmitting}
              >
                {isResetSubmitting ? "Sending..." : "Send Reset Link"}
              </Button>
              
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setShowResetForm(false)}
                  className="text-sm text-healthmate-400 hover:text-healthmate-500"
                >
                  Back to Login
                </button>
              </div>
            </form>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
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
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => setShowResetForm(true)}
                    className="text-sm text-healthmate-400 hover:text-healthmate-500"
                  >
                    Forgot password?
                  </button>
                </div>
                
                <Button
                  type="submit"
                  className="w-full bg-healthmate-400 hover:bg-healthmate-500"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Log in"}
                </Button>
                
                <div className="text-center text-sm">
                  <span className="text-gray-600 dark:text-gray-300">
                    Don't have an account?{" "}
                  </span>
                  <Link
                    to="/signup"
                    className="text-healthmate-400 hover:text-healthmate-500 font-medium"
                  >
                    Sign up
                  </Link>
                </div>
              </form>
            </Form>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Login;
