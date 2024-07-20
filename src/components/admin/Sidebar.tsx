import React from "react";
import StorefrontIcon from "@mui/icons-material/Storefront";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TimelineIcon from "@mui/icons-material/Timeline";
import LineStyleIcon from "@mui/icons-material/LineStyle";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import BarChartIcon from "@mui/icons-material/BarChart";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import DynamicFeedIcon from "@mui/icons-material/DynamicFeed";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ReportIcon from "@mui/icons-material/Report";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import AddBusinessOutlinedIcon from "@mui/icons-material/AddBusinessOutlined";
import Link from "next/link";

const Sidebar: React.FC = () => {
  return (
    <div className="h-screen bg-gray-50 w-60">
      <div className="p-5 text-gray-700">
        <div className="mb-3">
          <h3 className="text-xs text-gray-400">Dashboard</h3>
          <ul className="list-none p-1">
            <Link href="/" className="no-underline">
              <li className="p-1 cursor-pointer flex items-center rounded-lg hover:bg-gray-200">
                <LineStyleIcon className="mr-1 text-lg" />
                Home
              </li>
            </Link>
            <li className="p-1 cursor-pointer flex items-center rounded-lg hover:bg-gray-200">
              <TimelineIcon className="mr-1 text-lg" />
              Analytics
            </li>
            <li className="p-1 cursor-pointer flex items-center rounded-lg hover:bg-gray-200">
              <TrendingUpIcon className="mr-1 text-lg" />
              Sales
            </li>
          </ul>
        </div>
        <div className="mb-3">
          <h3 className="text-xs text-gray-400">Quick Menu</h3>
          <ul className="list-none p-1">
            <Link href="/admin/user-list" className="no-underline">
              <li className="p-1 cursor-pointer flex items-center rounded-lg hover:bg-gray-200">
                <PermIdentityIcon className="mr-1 text-lg" />
                Users
              </li>
            </Link>
            <Link href="/admin/add-product" className="no-underline">
              <li className="p-1 cursor-pointer flex items-center rounded-lg hover:bg-gray-200">
                <AddBusinessOutlinedIcon className="mr-1 text-lg" />
                Add Products
              </li>
            </Link>
            <Link href="/admin/product-list" className="no-underline">
              <li className="p-1 cursor-pointer flex items-center rounded-lg hover:bg-gray-200">
                <StorefrontIcon className="mr-1 text-lg" />
                Products
              </li>
            </Link>
            <li className="p-1 cursor-pointer flex items-center rounded-lg hover:bg-gray-200">
              <CurrencyRupeeIcon className="mr-1 text-lg" />
              Transactions
            </li>
            <li className="p-1 cursor-pointer flex items-center rounded-lg hover:bg-gray-200">
              <BarChartIcon className="mr-1 text-lg" />
              Reports
            </li>
          </ul>
        </div>
        <div className="mb-3">
          <h3 className="text-xs text-gray-400">Notifications</h3>
          <ul className="list-none p-1">
            <li className="p-1 cursor-pointer flex items-center rounded-lg hover:bg-gray-200">
              <MailOutlineIcon className="mr-1 text-lg" />
              Mail
            </li>
            <li className="p-1 cursor-pointer flex items-center rounded-lg hover:bg-gray-200">
              <DynamicFeedIcon className="mr-1 text-lg" />
              Feedback
            </li>
            <li className="p-1 cursor-pointer flex items-center rounded-lg hover:bg-gray-200">
              <ChatBubbleOutlineIcon className="mr-1 text-lg" />
              Messages
            </li>
          </ul>
        </div>
        <div className="mb-3">
          <h3 className="text-xs text-gray-400">Staff</h3>
          <ul className="list-none p-1">
            <li className="p-1 cursor-pointer flex items-center rounded-lg hover:bg-gray-200">
              <WorkOutlineIcon className="mr-1 text-lg" />
              Manage
            </li>
            <li className="p-1 cursor-pointer flex items-center rounded-lg hover:bg-gray-200">
              <TimelineIcon className="mr-1 text-lg" />
              Analytics
            </li>
            <li className="p-1 cursor-pointer flex items-center rounded-lg hover:bg-gray-200">
              <ReportIcon className="mr-1 text-lg" />
              Reports
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
