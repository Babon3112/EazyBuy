import React, { useState, useEffect } from "react";
import { format } from "timeago.js";

interface Order {
  _id: string;
  userID: string;
  createdAt: string;
  amount: number;
  status: string;
}

const WidgetLg: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  const Button: React.FC<{ type: string }> = ({ type }) => {
    const baseStyles = "px-2 py-1 rounded-md";
    const styles = {
      Approved: "bg-green-100 text-green-600",
      Declined: "bg-red-100 text-red-600",
      Pending: "bg-blue-100 text-blue-600",
    };
    return <button className=""></button>;
  };

  return (
    <div className="flex-2 shadow-md p-5">
      <h3 className="text-lg font-semibold">Latest transactions</h3>
      <table className="w-full border-spacing-5">
        <thead>
          <tr>
            <th className="text-left">Customer</th>
            <th className="text-left">Date</th>
            <th className="text-left">Amount</th>
            <th className="text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td className="flex items-center font-semibold">
                <img
                  src=""
                  alt=""
                  className="w-10 h-10 rounded-full object-cover mr-2.5"
                />
                <span>{order.userID}</span>
              </td>
              <td className="font-light">{format(order.createdAt)}</td>
              <td className="font-light">₹{order.amount}</td>
              <td>
                <Button type={order.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WidgetLg;
