
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import useSupabase from "@/hooks/useSupabase";

const profileSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email("Please enter a valid email"),
  age: z.string().min(1, { message: "Age is required" }),
  gender: z.string().min(1, { message: "Gender is required" }),
  location: z.string().optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, { message: "Current password is required" }),
  newPassword: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const Profile = () => {
  const { user, loading, updateProfile, updatePassword, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const supabase = useSupabase();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      age: user?.age?.toString() || "",
      gender: user?.gender || "",
      location: user?.location || "",
    },
  });

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    // Check if user is authenticated
    if (!loading && !user) {
      toast({
        title: "Access denied",
        description: "Please log in to access your profile",
        variant: "destructive",
      });
      navigate("/login");
    } else if (user) {
      // Populate form with user data
      profileForm.reset({
        name: user.name || "",
        email: user.email || "",
        age: user.age?.toString() || "",
        gender: user.gender || "",
        location: user.location || "",
      });

      // Set avatar URL if it exists
      setAvatarUrl(user.avatar_url || null);
    }
  }, [user, loading, navigate, toast, profileForm]);

  const onProfileSubmit = async (values: z.infer<typeof profileSchema>) => {
    try {
      await updateProfile({
        name: values.name,
        email: values.email,
        age: parseInt(values.age),
        gender: values.gender,
        location: values.location,
        avatar_url: avatarUrl,
      });
    } catch (error) {
      console.error("Profile update failed:", error);
    }
  };

  const onPasswordSubmit = async (values: z.infer<typeof passwordSchema>) => {
    try {
      await updatePassword(values.newPassword);
      passwordForm.reset();
    } catch (error) {
      console.error("Password update failed:", error);
    }
  };

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }

      const file = event.target.files[0];
      
      setUploading(true);

      // Upload avatar using the uploadAvatar method from our hook
      const url = await supabase.storage.uploadAvatar(file);
      
      // Update user profile with new avatar URL
      if (url) {
        setAvatarUrl(url);
        
        toast({
          title: "Avatar updated",
          description: "Your profile picture has been updated successfully",
        });
      }
    } catch (error) {
      console.error("Avatar upload failed:", error);
      toast({
        title: "Upload failed",
        description: "There was a problem uploading your avatar",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteAccount = async () => {
    // This would be integrated with Supabase to delete the user account
    const confirm = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
    
    if (confirm) {
      try {
        // Mock account deletion
        await signOut();
        toast({
          title: "Account deleted",
          description: "Your account has been deleted successfully",
        });
        navigate("/");
      } catch (error) {
        console.error("Account deletion failed:", error);
        toast({
          title: "Deletion failed",
          description: "There was a problem deleting your account",
          variant: "destructive",
        });
      }
    }
  };

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
        <div className="container-custom max-w-4xl">
          <div className="bg-white dark:bg-healthmate-700 rounded-xl shadow-md overflow-hidden">
            <div className="p-8 bg-healthmate-50 dark:bg-healthmate-600 border-b border-gray-200 dark:border-healthmate-500">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-healthmate-500 overflow-hidden">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-4xl font-bold text-gray-400 dark:text-gray-600">
                        {user?.name?.charAt(0).toUpperCase() || "?"}
                      </div>
                    )}
                  </div>
                  <label
                    htmlFor="avatar-upload"
                    className="absolute bottom-0 right-0 bg-white dark:bg-healthmate-500 w-8 h-8 rounded-full shadow-md flex items-center justify-center cursor-pointer border border-gray-200 dark:border-healthmate-400"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-gray-600 dark:text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={handleAvatarChange}
                      disabled={uploading}
                    />
                  </label>
                </div>
                
                <div className="text-center md:text-left">
                  <h1 className="text-2xl font-bold text-healthmate-700 dark:text-white">
                    {user?.name}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300">
                    {user?.email}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                    {user?.location && `${user.location} • `}
                    {user?.gender && `${user.gender} • `}
                    {user?.age && `${user.age} years old`}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-8">
              <Tabs defaultValue="profile">
                <TabsList className="mb-8">
                  <TabsTrigger value="profile">Profile Information</TabsTrigger>
                  <TabsTrigger value="password">Change Password</TabsTrigger>
                </TabsList>
                
                <TabsContent value="profile">
                  <Form {...profileForm}>
                    <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={profileForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input placeholder="John Doe" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={profileForm.control}
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
                          control={profileForm.control}
                          name="age"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Age</FormLabel>
                              <FormControl>
                                <Input type="number" placeholder="30" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={profileForm.control}
                          name="gender"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Gender</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select gender" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="male">Male</SelectItem>
                                  <SelectItem value="female">Female</SelectItem>
                                  <SelectItem value="non-binary">Non-binary</SelectItem>
                                  <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={profileForm.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Location (Optional)</FormLabel>
                              <FormControl>
                                <Input placeholder="City, Country" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <Button
                        type="submit"
                        className="bg-healthmate-400 hover:bg-healthmate-500"
                      >
                        Save Changes
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
                
                <TabsContent value="password">
                  <Form {...passwordForm}>
                    <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                      <FormField
                        control={passwordForm.control}
                        name="currentPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={passwordForm.control}
                        name="newPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>New Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={passwordForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm New Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button
                        type="submit"
                        className="bg-healthmate-400 hover:bg-healthmate-500"
                      >
                        Update Password
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
              </Tabs>
              
              <div className="mt-12 pt-6 border-t border-gray-200 dark:border-healthmate-600">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Danger Zone
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <Button
                  variant="destructive"
                  onClick={handleDeleteAccount}
                >
                  Delete Account
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;
