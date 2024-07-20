"use client";
import { useState } from "react";
import Navbar from "@/components/user/Navbar";
import Announcements from "@/components/user/Announcements";
import NewsLetter from "@/components/user/NewsLetter";
import Footer from "@/components/user/Footer";
import axios from "axios";
import { signOut } from "next-auth/react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { changePasswordSchema } from "@/schemas/changePasswordSchema";
import { toast } from "@/components/ui/use-toast";

const ChangePasswordPage = () => {
  const [message, setMessage] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof changePasswordSchema>>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof changePasswordSchema>) => {
    if (data.currentPassword === data.newPassword) {
      setMessage("Your new password should be different.");
      toast({
        title: "Your new password should be different.",
        variant: "destructive",
      });
      return;
    }

    if (data.newPassword !== data.confirmPassword) {
      setMessage("Both password and confirm password should match");
      toast({
        title: "Both password and confirm password should match.",
        variant: "destructive",
      });
      return;
    }
    try {
      setIsSubmitting(true);
      await axios
        .post("/api/users/change-password", {
          ...data,
        })
        .then((response) => {
          {
            toast({ title: "Password changed successfully." });
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          }
        });
    } catch (error: any) {
      setIsSubmitting(false);
      console.log(error);

      toast({
        title: "Invalid password",
        variant: "destructive",
      });
    } finally {
      setMessage("");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-200">
      <Announcements />
      <Navbar />
      <div className="flex flex-col items-center py-16 px-6">
        <div className="bg-white p-8 mt-8 rounded-lg shadow-lg w-[23rem] text-center">
          <h1 className="text-3xl mb-6 text-gray-800">Change Password</h1>
          <Form {...form}>
            <form
              className="flex flex-col  space-y-4"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                name="currentPassword"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex justify-start">
                      Current Password
                    </FormLabel>
                    <FormControl>
                      <div className="flex w-full">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="current Password"
                          {...field}
                          className="flex-1 p-4 border rounded-none rounded-l-md border-gray-300 focus:outline-none focus:border-teal-500 border-r-0"
                          onFocus={() => setIsFocused(true)}
                          onBlur={() => setIsFocused(false)}
                        />
                        <Button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className={`p-4 text-gray-500 border-gray-300 rounded-none rounded-r-md hover:bg-white border border-l-0 bg-transparent ${
                            isFocused
                              ? "outline-none border-teal-500 border border-l-0"
                              : ""
                          }`}
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="newPassword"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex justify-start">
                      New Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        type={showNewPassword ? "text" : "password"}
                        placeholder="new password"
                        {...field}
                        className="flex-1 min-w-full p-4 rounded-md border border-gray-300 focus:outline-none focus:border-teal-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="confirmPassword"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex justify-start">
                      Comfirm Password
                    </FormLabel>
                    <FormControl>
                      <div className="flex w-full">
                        <Input
                          type={showNewPassword ? "text" : "password"}
                          placeholder="confirm Password"
                          {...field}
                          className="flex-1 p-4 border rounded-none rounded-l-md border-gray-300 focus:outline-none focus:border-teal-500 border-r-0"
                          onFocus={() => setIsFocused(true)}
                          onBlur={() => setIsFocused(false)}
                        />
                        <Button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className={`p-4 text-gray-500 border-gray-300 rounded-none rounded-r-md hover:bg-white border border-l-0 bg-transparent ${
                            isFocused
                              ? "outline-none border-teal-500 border border-l-0"
                              : ""
                          }`}
                        >
                          {showNewPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2 text-lg font-medium text-white bg-teal-500 rounded-md transition-all duration-300 ease-in-out hover:bg-teal-600"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 animate-spin" /> Please wait...
                  </>
                ) : (
                  "Change Password"
                )}
              </Button>
            </form>
          </Form>
          {message && <p className="mt-4 text-red-500 text-sm">{message}</p>}
        </div>
      </div>
      <NewsLetter />
      <Footer />
    </div>
  );
};

export default ChangePasswordPage;
