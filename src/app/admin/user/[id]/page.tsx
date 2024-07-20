"use client";
import Navbar from "@/components/admin/Navbar";
import Sidebar from "@/components/admin/Sidebar";
import {
  CalendarToday,
  MailOutline,
  LocationSearching,
  PermIdentity,
  PhoneAndroid,
  Publish,
} from "@mui/icons-material";
import axios from "axios";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface User {
  _id: string;
  avatar?: string;
  username: string;
  fullname: string;
  mobileno: string;
  email: string;
  isVerified: boolean;
  isAdmin: boolean;
  createdAt: Date | string;
}

export default function User() {
  const [user, setUser] = useState<User | null>(null);
  const { id } = useParams();

  const getUser = async () => {
    const response = await axios.get(`/api/admin/get-user/?userId=${id}`);
    const userData = response.data.user;
    userData.createdAt = new Date(userData.createdAt);
    setUser(userData);
  };

  useEffect(() => {
    getUser();
  }, [id]);

  return (
    <>
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex flex-col flex-4 p-5">
          <div className="flex items-center justify-between mb-5">
            <h1 className="text-2xl font-semibold">View User</h1>
          </div>
          <div className="flex flex-col mt-8 ml-6">
            <div className="flex-1 p-5 shadow-md w-[25rem]">
              <div className="flex items-center">
                <img
                  src={
                    user?.avatar ||
                    "https://res.cloudinary.com/arnabcloudinary/image/upload/v1713427478/EazyBuy/Avatar/no-avatar.png"
                  }
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="ml-5">
                  <span className="font-semibold">{user?.fullname}</span>
                </div>
              </div>
              <div className="mt-5">
                <span className="text-sm font-semibold text-gray-500">
                  Account Details
                </span>
                <div className="flex items-center mt-5 text-gray-700">
                  <PermIdentity className="text-lg" />
                  <span className="ml-2">{user?.username} </span>
                </div>
                <div className="flex items-center mt-5 text-gray-700">
                  <CalendarToday className="text-lg" />
                  <span className="ml-2">
                    {user?.createdAt instanceof Date
                      ? user.createdAt.toLocaleDateString()
                      : ""}
                  </span>
                </div>
                <span className="mt-5 text-sm font-semibold text-gray-500">
                  Contact Details
                </span>
                <div className="flex items-center mt-5 text-gray-700">
                  <PhoneAndroid className="text-lg" />
                  <span className="ml-2">{user?.mobileno}</span>
                </div>
                <div className="flex items-center mt-5 text-gray-700">
                  <MailOutline className="text-lg" />
                  <span className="ml-2">{user?.email}</span>
                </div>
                <div className="flex items-center mt-5 text-gray-700">
                  <LocationSearching className="text-lg" />
                  <span className="ml-2">New York | USA</span>
                </div>
              </div>
            </div>
            <div className="flex-2 p-5 shadow-md ml-72 mt-6">
              <span className="text-xl font-semibold">Details</span>
              <form className="flex justify-between mt-5">
                <div className="flex flex-col space-y-5">
                  <div className="flex flex-col">
                    <label className="mb-1 text-sm">Username</label>
                    <input
                      type="text"
                      value={user?.username}
                      className="w-64 h-8 border-b border-gray-400 focus:outline-none"
                      readOnly
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="mb-1 text-sm">Full Name</label>
                    <input
                      type="text"
                      value={user?.fullname}
                      className="w-64 h-8 border-b border-gray-400 focus:outline-none"
                      readOnly
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="mb-1 text-sm">Phone</label>
                    <input
                      type="text"
                      value={user?.mobileno}
                      className="w-64 h-8 border-b border-gray-400 focus:outline-none"
                      readOnly
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="mb-1 text-sm">Email</label>
                    <input
                      type="text"
                      value={user?.email}
                      className="w-64 h-8 border-b border-gray-400 focus:outline-none"
                      readOnly
                    />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="isAdmin" className="mb-1 text-sm">
                      Is Admin
                    </label>
                    <select
                      name="isAdmin"
                      value={user?.isAdmin ? "true" : "false"}
                      className="w-full p-1 border border-gray-300 rounded bg-gray-100 text-gray-700"
                    >
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </div>
                </div>
                <div className="flex flex-col justify-between">
                  <div className="flex items-center">
                    <img
                      className="w-40 h-40 rounded-3xl object-cover ml-8"
                      src={
                        user?.avatar ||
                        "https://res.cloudinary.com/arnabcloudinary/image/upload/v1713427478/EazyBuy/Avatar/no-avatar.png"
                      }
                      alt="User Avatar"
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
