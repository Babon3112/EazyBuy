import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { useState, useEffect } from "react";

interface IncomeData {
  total: number;
}

const FeaturedInfo: React.FC = () => {
  const [income, setIncome] = useState<IncomeData[]>([]);
  const [percentage, setPercentage] = useState(0);

  return (
    <div className="w-full flex justify-between">
      <div className="flex-1 m-5 p-8 rounded-lg cursor-pointer shadow-md">
        <span className="text-xl">Revenue</span>
        <div className="my-2 flex items-center">
          <span className="text-2xl font-semibold">₹{income[1]?.total}</span>
          <span className="flex items-center ml-5">
            %{Math.floor(percentage)}{" "}
            {percentage < 0 ? (
              <ArrowDownwardIcon className="text-red-600 ml-1" />
            ) : (
              <ArrowUpwardIcon className="text-green-600 ml-1" />
            )}
          </span>
        </div>
        <span className="text-gray-500">Compared to last month</span>
      </div>
      <div className="flex-1 m-5 p-8 rounded-lg cursor-pointer shadow-md">
        <span className="text-xl">Sales</span>
        <div className="my-2 flex items-center">
          <span className="text-2xl font-semibold">₹</span>
          <span className="flex items-center ml-5">
            -1.4 <ArrowDownwardIcon className="text-red-600 ml-1" />
          </span>
        </div>
        <span className="text-gray-500">Compared to last month</span>
      </div>
      <div className="flex-1 m-5 p-8 rounded-lg cursor-pointer shadow-md">
        <span className="text-xl">Cost</span>
        <div className="my-2 flex items-center">
          <span className="text-2xl font-semibold"></span>
          <span className="flex items-center ml-5">
            +2.4 <ArrowUpwardIcon className="text-green-600 ml-1" />
          </span>
        </div>
        <span className="text-gray-500">Compared to last month</span>
      </div>
    </div>
  );
};

export default FeaturedInfo;
