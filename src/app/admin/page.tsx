"use client";
import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import Navbar from "@/components/admin/Navbar";
import Sidebar from "@/components/admin/Sidebar";

const Chart = dynamic(() => import("@/components/admin/Chart"));
const FeaturedInfo = dynamic(() => import("@/components/admin/FeaturedInfo"));
const WidgetSm = dynamic(() => import("@/components/admin/WidgetSm"));
const WidgetLg = dynamic(() => import("@/components/admin/WidgetLg"));

type UserStat = {
  name: string;
  "Active User": number;
};

const Home: React.FC = () => {
  const [userStats, setUserStats] = useState<UserStat[]>([]);

  const MONTHS = useMemo(
    () => [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    []
  );

  return (
    <div className="flex flex-col flex-grow">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-grow">
          <FeaturedInfo />
          <Chart
            data={userStats}
            title="User Analytics"
            grid
            dataKey="Active User"
          />
          <div className="flex m-5">
            <WidgetSm />
            <WidgetLg />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
