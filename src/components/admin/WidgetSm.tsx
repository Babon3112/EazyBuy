import { useEffect, useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";

interface User {
  _id: string;
  avatar: string;
  fullName: string;
}

const WidgetSm: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  return (
    <div className="flex-1 shadow-md p-5 mr-5">
      <span className="text-xl font-semibold">New Join Members</span>
      <ul className="m-0 p-0 list-none">
        {users.map((user) => (
          <li className="flex items-center justify-between my-5" key={user._id}>
            <img
              src={
                user.avatar ||
                "https://res.cloudinary.com/arnabcloudinary/image/upload/v1713427478/EazyBuy/Avatar/no-avatar.png"
              }
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex flex-col">
              <span className="font-semibold">{user.fullName}</span>
            </div>
            <button className="flex items-center border-none rounded-lg px-3 py-2 bg-gray-200 text-gray-600 cursor-pointer">
              <VisibilityIcon className="text-base mr-1" />
              Display
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WidgetSm;
