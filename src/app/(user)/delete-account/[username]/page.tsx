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
import { deleteSchema } from "@/schemas/deleteSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "@/components/ui/use-toast";

const DeleteAccountPage = () => {
  const [message, setMessage] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof deleteSchema>>({
    resolver: zodResolver(deleteSchema),
    defaultValues: {
      message: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof deleteSchema>) => {
    if (!data.password) {
      setMessage("Please enter your password to delete your account.");
      toast({
        title: "Please enter your password to delete your account.",
        variant: "destructive",
      });
      return;
    }
    try {
      if (data.message === "DELETE") {
        setIsSubmitting(true);

        await axios
          .post("/api/users/delete-account", { password: data.password })
          .then(() => {
            toast({ title: "Your account has been deleted successfully." });
            setTimeout(() => {
              signOut();
            }, 1000);
          });
      } else {
        setMessage("Please type DELETE to confirm account deletion.");
        toast({
          title: "Please type DELETE to confirm account deletion.",
        });
      }
    } catch (error: any) {
      setIsSubmitting(false);
      toast({
        title: "Failed to delete account",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-200 min-h-screen">
      <Announcements />
      <Navbar />
      <div className="flex flex-col items-center justify-center py-16 px-6">
        <div className="bg-white p-8 mt-8 rounded-lg shadow-lg w-full max-w-lg text-center">
          <h1 className="text-3xl mb-6 text-gray-800">Delete Your Account</h1>
          <Form {...form}>
            <form
              className="flex flex-col w-full space-y-4"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                name="message"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      To confirm deletion, please type
                      <b> &quot;DELETE&quot; </b>
                      in the box below
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Type DELETE here"
                        {...field}
                        className="flex-1 min-w-full p-4 rounded-md border border-gray-300 focus:outline-none focus:border-teal-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      To confirm deletion, please enter your password
                    </FormLabel>
                    <FormControl>
                      <div className="flex w-full">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Your Password"
                          {...field}
                          className="flex-1 p-4 border rounded-none rounded-l-md border-gray-300 focus:outline-none focus:border-teal-500 border-r-0"
                          onFocus={() => setIsFocused(true)}
                          onBlur={() => setIsFocused(false)}
                        />
                        <Button
                          type="submit"
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
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2 text-lg font-medium text-white bg-red-600 rounded-md transition-all duration-300 ease-in-out hover:bg-red-700"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 animate-spin" /> Please wait...
                  </>
                ) : (
                  "Delete your account"
                )}
              </Button>
            </form>
          </Form>
          {message && <p className="mt-4 text-red-500">{message}</p>}
        </div>
      </div>
      <NewsLetter />
      <Footer />
    </div>
  );
};

export default DeleteAccountPage;
