"use client";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Link from "next/link";
import Navbar from "@/components/admin/Navbar";
import Sidebar from "@/components/admin/Sidebar";
import { useEffect, useState } from "react";
import axios from "axios";

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

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  const getUsers = async () => {
    try {
      const response = await axios.get("/api/admin/get-all-users");
      setUsers(response.data.users);
    } catch (error) {}
  };

  useEffect(() => {
    getUsers();
  }, []);

  const columns: GridColDef[] = [
    { field: "_id", headerName: "ID", width: 250 },
    {
      field: "user",
      headerName: "User",
      width: 75,
      renderCell: (params) => (
        <div>
          <img
            className="w-10 h-10 mt-1.5 rounded-full object-cover mr-2.5"
            src={
              params.row.avatar ||
              "https://res.cloudinary.com/arnabcloudinary/image/upload/v1713427478/EazyBuy/Avatar/no-avatar.png"
            }
            alt=""
          />
        </div>
      ),
    },
    { field: "username", headerName: "Username", width: 150 },
    { field: "fullname", headerName: "Full Name", width: 150 },
    { field: "mobileno", headerName: "mobile No", width: 120 },
    { field: "email", headerName: "Email", width: 300 },
    { field: "isVerified", headerName: "Verified", width: 100 },
    { field: "isAdmin", headerName: "Admin", width: 100 },
    { field: "createdAt", headerName: "Joined", width: 150 },
    {
      field: "action",
      headerName: "Action",
      width: 100,
      renderCell: (params) => (
        <>
          <Link
            href={`/admin/user/${params.row._id}`}
            className="border-none rounded-lg px-2.5 py-2 bg-teal-500 text-white cursor-pointer"
          >
            View
          </Link>
        </>
      ),
    },
  ];

  return (
    <>
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-4">
          <DataGrid
            rows={users}
            columns={columns}
            getRowId={(row) => row._id}
            checkboxSelection
          />
        </div>
      </div>
    </>
  );
};

export default UserList;
