import React from "react";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import LanguageIcon from "@mui/icons-material/Language";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

const Navbar: React.FC = () => {
  const { data: session } = useSession();
  return (
    <div className=" h-14 bg-white">
      <div className="h-full px-5 flex items-center justify-between">
        <div className="font-bold text-2xl text-teal-500 cursor-pointer">
          eazybuyadmin
        </div>
        <div className="flex items-center">
          <div className="relative cursor-pointer mr-2.5 text-gray-700">
            <NotificationsNoneIcon />
            <span className="w-4 h-4 absolute top-[-5px] right-0 bg-red-500 text-white rounded-full flex items-center justify-center text-xs">
              2
            </span>
          </div>
          <div className="relative cursor-pointer mr-2.5 text-gray-700">
            <LanguageIcon />
            <span className="w-4 h-4 absolute top-[-5px] right-0 bg-red-500 text-white rounded-full flex items-center justify-center text-xs">
              2
            </span>
          </div>
          <div className="cursor-pointer text-gray-700">
            <SettingsIcon />
          </div>
          <img
            src={
              session?.user.avatar ||
              "https://res.cloudinary.com/arnabcloudinary/image/upload/v1713427478/EazyBuy/Avatar/no-avatar.png"
            }
            alt=""
            className="w-10 h-10 rounded-full cursor-pointer ml-2.5"
          />
          <Link href="/signin">
            <div
              className="flex items-center justify-center ml-2.5 text-black font-semibold cursor-pointer"
              onClick={() => signOut()}
            >
              Log Out
              <LogoutIcon fontSize="small" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
