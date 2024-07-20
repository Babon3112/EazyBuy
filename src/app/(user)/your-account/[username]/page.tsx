"use client";
import { useState, ChangeEvent, useEffect } from "react";
import Announcements from "@/components/user/Announcements";
import Navbar from "@/components/user/Navbar";
import NewsLetter from "@/components/user/NewsLetter";
import Footer from "@/components/user/Footer";
import { useSession } from "next-auth/react";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useDebounceCallback } from "usehooks-ts";
import { ApiResponse } from "@/types/ApiResponse";
import { changeDeatailSchema } from "@/schemas/changeDetailsSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

const YourAccountPage: React.FC = () => {
  const { data: session, update } = useSession();
  const user = session?.user;

  const form = useForm<z.infer<typeof changeDeatailSchema>>({
    resolver: zodResolver(changeDeatailSchema),
    defaultValues: {
      fullname: user?.fullname || "",
      username: user?.username || "",
      mobileno: user?.mobileno || "",
      email: user?.email || "",
    },
  });

  const [avatar, setAvatar] = useState<File | null>(null);
  const [username, setUsername] = useState<string>(user?.username || "");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModified, setIsModified] = useState(false);

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setAvatar(file);
    setIsModified(true);
  };

  const isValidMobile = (mobile: string) => {
    const re = /^[0-9]{10}$/;
    return re.test(mobile);
  };

  const isValidEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const debounced = useDebounceCallback(setUsername, 400);
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username !== user?.username) {
        setIsCheckingUsername(true);
        setUsernameMessage("");
        try {
          const response = await axios.get(
            `/api/users/check-unique-username?username=${username}`
          );
          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message ?? "Error while checking username"
          );
        } finally {
          setIsCheckingUsername(false);
        }
      } else {
        setUsernameMessage("");
      }
    };

    checkUsernameUnique();
  }, [username]);

  useEffect(() => {
    const subscription = form.watch((value) => {
      setIsModified(
        value.fullname !== user.fullname ||
          value.username !== user.username ||
          value.mobileno !== user.mobileno ||
          value.email !== user.email ||
          !!avatar
      );
    });

    return () => subscription.unsubscribe();
  }, [form, avatar]);

  const onSubmit = async (data: z.infer<typeof changeDeatailSchema>) => {
    if (!isValidMobile(data.mobileno)) {
      toast({
        title: "Please enter a valid mobile number",
        variant: "destructive",
      });
      return;
    }

    if (!isValidEmail(data.email)) {
      toast({ title: "Please enter a valid email", variant: "destructive" });
      return;
    }

    const formData = new FormData();
    if (data.fullname !== user?.fullname)
      formData.append("fullname", data.fullname);
    if (data.username !== user?.username)
      formData.append("username", data.username);
    if (data.mobileno !== user?.mobileno)
      formData.append("mobileno", data.mobileno);
    if (data.email !== user?.email) formData.append("email", data.email);
    if (avatar) formData.append("avatar", avatar);

    try {
      setIsSubmitting(true);
      const response = await axios.post("/api/users/change-details", formData);
      const updatedUser = response.data.updatedUser;

      setIsSubmitting(false);
      if (response.status === 200) {
        await update({
          fullname: updatedUser.fullname,
          avatar: updatedUser.avatar,
          username: updatedUser.username,
          mobileno: updatedUser.mobileno,
          email: updatedUser.email,
        });
        toast({ title: "Your details updated successfully" });
      }
    } catch (error: any) {
      setIsSubmitting(false);
      console.error(error);
      toast({
        title: "Failed to update your details",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-gray-100">
      <Announcements />
      <Navbar />
      <div className="flex flex-col items-center justify-center p-20 text-center">
        <div className="flex flex-col items-center justify-center p-5 bg-white rounded-lg shadow-md">
          <Form {...form}>
            <form
              className="w-80 flex flex-col justify-center items-center space-y-4"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <label className="cursor-pointer text-center">
                {avatar ? (
                  <img
                    src={URL.createObjectURL(avatar)}
                    alt="Avatar"
                    className="w-36 h-36 rounded-full my-5 object-cover shadow-lg"
                  />
                ) : (
                  <img
                    src={
                      user?.avatar ||
                      "https://res.cloudinary.com/arnabcloudinary/image/upload/v1713075500/EazyBuy/Avatar/upload-avatar.png"
                    }
                    alt="Avatar"
                    className="w-36 h-36 rounded-full my-5 object-cover shadow-lg"
                  />
                )}
                <input
                  type="file"
                  id="avatar"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
              <FormField
                name="fullname"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="Full name"
                        className="flex-1 w-80 p-4 rounded-md border border-gray-300 focus:outline-none focus:border-teal-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="username"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="Username"
                        className="flex-1 w-80 p-4 rounded-md border border-gray-300 focus:outline-none focus:border-teal-500"
                        onChange={(e) => {
                          field.onChange(e);
                          debounced(e.target.value);
                        }}
                      />
                    </FormControl>
                    {isCheckingUsername && (
                      <Loader2 className="animate-spin mx-auto mt-2 text-teal-500" />
                    )}
                    <p
                      className={`text-sm mt-1 text-left ${
                        usernameMessage === "Username is available"
                          ? "text-[#80CBC4]"
                          : "text-[#FF7043]"
                      }`}
                    >
                      {usernameMessage}
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="mobileno"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="Mobile no."
                        className="flex-1 w-80 p-4 rounded-md border border-gray-300 focus:outline-none focus:border-teal-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="Email"
                        className="flex-1 w-80 p-4 rounded-md border border-gray-300 focus:outline-none focus:border-teal-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={isSubmitting || !isModified}
                className={`w-full py-2 text-lg font-medium text-white bg-teal-500 rounded-md transition-all duration-300 ease-in-out hover:bg-teal-600 ${
                  isModified ? "" : "bg-gray-700"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Details"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
      <NewsLetter />
      <Footer />
    </div>
  );
};

export default YourAccountPage;
