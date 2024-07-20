"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { signupSchema } from "@/schemas/signupSchema";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useDebounceCallback } from "usehooks-ts";
import { ApiResponse } from "@/types/ApiResponse";

const SignupPage = () => {
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullname: "",
      username: "",
      mobileno: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const debounced = useDebounceCallback(setUsername, 400);
  const router = useRouter();

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
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
      }
    };

    checkUsernameUnique();
  }, [username]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setAvatar(file);
    }
  };

  const onSubmit = async (data: z.infer<typeof signupSchema>) => {
    try {
      const formData = new FormData();
      if (avatar) formData.append("avatar", avatar);
      formData.append("fullname", data.fullname);
      formData.append("username", data.username.toLocaleLowerCase());
      formData.append("mobileno", data.mobileno);
      formData.append("email", data.email);
      formData.append("password", data.password);

      let verifyUrl = "";
      const baseUrl = `${window.location.protocol}//${window.location.host}`;
      verifyUrl = `${baseUrl}/verify/${data.username}`;
      formData.append("verifyUrl", verifyUrl);

      setIsSubmitting(true);
      await axios.post("/api/users/signup", formData).then((response) => {
        toast({ title: response.data.message });
        if (response.status === 201) {
          router.replace(`/verify/${data.username}`);
        }
      });
      setIsSubmitting(false);
    } catch (error: any) {
      setIsSubmitting(false);
      console.error(error);
      toast({
        title: "Failed to create account.",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="flex flex-col items-center justify-center w-[30rem] p-8 bg-white bg-opacity-90 rounded-3xl shadow-lg border border-gray-400">
        <h1 className="text-center text-2xl font-normal mb-5 text-gray-800">
          CREATE AN ACCOUNT
        </h1>
        <Form {...form}>
          <form
            className="flex flex-col w-full space-y-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="flex items-center justify-center">
              <label className="cursor-pointer">
                {avatar ? (
                  <img
                    src={URL.createObjectURL(avatar)}
                    alt="Avatar Preview"
                    className="w-24 h-24 rounded-full object-cover m-2 shadow-xl"
                  />
                ) : (
                  <img
                    src="https://res.cloudinary.com/arnabcloudinary/image/upload/v1713075500/EazyBuy/Avatar/upload-avatar.png"
                    alt="Upload Avatar"
                    className="w-24 h-24 rounded-full object-cover m-2 shadow-xl"
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
            </div>
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
                      className="flex-1 min-w-full p-4 rounded-md border border-gray-300 focus:outline-none focus:border-teal-500"
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
                      className="flex-1 min-w-full p-4 rounded-md border border-gray-300 focus:outline-none focus:border-teal-500"
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
                    className={`text-sm mt-1 ${
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
                      className="flex-1 min-w-full p-4 rounded-md border border-gray-300 focus:outline-none focus:border-teal-500"
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
                  <FormControl>
                    <Input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
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
                  <FormControl>
                    <div className="flex w-full">
                      <Input
                        {...field}
                        type={showPassword ? "text" : "password"}
                        placeholder="Confirm Password"
                        className="flex-1 p-4 rounded-none rounded-l-md border-r-0 border-gray-300 focus:outline-none focus:border-teal-500"
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
            <span className="text-sm my-4 text-gray-600 text-center">
              By creating an account, I consent to the processing of your
              personal data in accordance with the <b>PRIVACY POLICY</b>
            </span>
            <div className="w-full flex justify-center">
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
                  "Sign Up"
                )}
              </Button>
            </div>
          </form>
        </Form>
        <p className="mt-4 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link href="/signin" className="text-teal-500 underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
