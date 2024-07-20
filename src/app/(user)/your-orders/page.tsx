"use client";
import { Input } from "@/components/ui/input";
import Announcements from "@/components/user/Announcements";
import Footer from "@/components/user/Footer";
import Navbar from "@/components/user/Navbar";
import NewsLetter from "@/components/user/NewsLetter";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";

interface Order {
  _id: string;
  details: {
    name: string;
    email: string;
    mobileno: string;
  };
  address: {
    street: string;
    landmark: string;
    city: string;
    postalCode: string;
  };
  products: Array<{
    productId: string;
    image: string;
    brand: string;
    title: string;
    color: string;
    size: string;
    quantity: number;
    price: number;
  }>;
  amount: number;
  status: string;
  paymentMethod: string;
  createdAt: string;
}

const Page = () => {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderDetails, setOrderDetails] = useState({
    name: "",
    email: "",
    mobileno: "",
  });
  const [orderAddress, setOrderAddress] = useState({
    street: "",
    landmark: "",
    city: "",
    postalCode: "",
  });

  const getOrders = useCallback(async () => {
    if (!session) return;
    try {
      const response = await axios.get("/api/users/orders/get-orders");
      setOrders(response.data.orders);
    } catch (error) {
      console.error("Failed to fetch orders", error);
    }
  }, [session]);

  useEffect(() => {
    getOrders();
  }, [getOrders]);

  const cancelOrder = useCallback(
    async (orderId: string) => {
      try {
        await axios.post("/api/users/orders/cancel-order/", { orderId });
        getOrders();
      } catch (error) {
        console.error("Failed to cancel order", error);
      }
    },
    [getOrders]
  );

  const updateOrder = useCallback(
    async (orderId: string) => {
      try {
        await axios.post("/api/users/orders/update-order", {
          orderId,
          details: orderDetails,
          address: orderAddress,
        });
        getOrders();
        setSelectedOrder(null);
      } catch (error) {
        console.error("Failed to update order", error);
      }
    },
    [getOrders, orderDetails, orderAddress]
  );

  const handleUpdateClick = (order: Order) => {
    setSelectedOrder(order);
    setOrderDetails(order.details);
    setOrderAddress(order.address);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Announcements />
      <Navbar />
      <div className="p-5 bg-white rounded-xl shadow-md mx-auto w-4/5 my-10">
        {orders?.map((order: Order) => (
          <div
            key={order._id}
            className="border border-teal-200 rounded-xl mb-6 m-2 shadow-sm"
          >
            <div className="space-y-4 bg-gray-50 p-6">
              {order.products.map((product) => (
                <div key={product.productId} className="flex items-center mb-4">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-20 h-20 object-cover rounded-full shadow-md"
                  />
                  <div className="ml-4">
                    <p>{product.brand}</p>
                    <p className="font-semibold text-lg">
                      Product: {product.title}
                    </p>
                    <p className="text-gray-600">Color: {product.color}</p>
                    <p className="text-gray-600">Size: {product.size}</p>
                    <div className="flex space-x-4 mt-2 text-gray-600">
                      <p>Quantity: {product.quantity}</p>
                      <p>Price: ₹{product.price}</p>
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex flex-col mobile:flex-row justify-between items-center mt-4 border-t pt-4">
                <p className="font-semibold text-xl">
                  Total Price: ₹{order.amount}
                </p>
                <p>
                  Status:{" "}
                  <span
                    className={`px-2 py-1 rounded ${
                      order.status === "Delivered"
                        ? "bg-green-300 text-green-800"
                        : order.status === "Placed"
                        ? "bg-yellow-300 text-yellow-800"
                        : "bg-red-300 text-red-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </p>
                <p className="text-gray-600">Payment: {order.paymentMethod}</p>
                <p className="text-gray-600">
                  {new Date(order.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="flex mt-2 text-gray-600">
                <div>
                  <p className="font-semibold">Details:</p>
                  <p>{order.details.name}</p>
                  <p>{order.details.email}</p>
                  <p>{order.details.mobileno}</p>
                </div>
                <div className="ml-8">
                  <p className="font-semibold">Address:</p>
                  <p>{order.address.street}</p>
                  <p>{order.address.landmark}</p>
                  <p>{order.address.city}</p>
                  <p>{order.address.postalCode}</p>
                </div>
              </div>
            </div>
            {order.status === "Placed" && (
              <div className="flex items-end">
                <button
                  className="h-11 w-1/2 transition-all bg-teal-500 hover:bg-teal-600 text-white font-medium p-2 flex justify-center items-center rounded-bl-xl"
                  onClick={() => handleUpdateClick(order)}
                >
                  Update Order
                </button>
                <button
                  className="h-11 w-1/2 transition-all duration-200 bg-red-500 hover:bg-red-600 text-white font-medium p-2 flex justify-center items-center rounded-br-xl"
                  onClick={() => cancelOrder(order._id)}
                >
                  Cancel Order
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      <NewsLetter />
      <Footer />
      {selectedOrder && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-md w-1/3">
            <h2 className="text-xl font-bold mb-4">Update Order Details</h2>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Name:</label>
              <Input
                type="text"
                placeholder="Full name..."
                value={orderDetails.name}
                onChange={(e) =>
                  setOrderDetails({ ...orderDetails, name: e.target.value })
                }
                required
                className="w-full p-2 border border-gray-300 rounded mt-1 mb-3"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Email:</label>
              <Input
                type="email"
                placeholder="Email..."
                value={orderDetails.email}
                onChange={(e) =>
                  setOrderDetails({ ...orderDetails, email: e.target.value })
                }
                required
                className="w-full p-2 border border-gray-300 rounded mt-1 mb-3"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Mobile No:</label>
              <Input
                type="number"
                placeholder="Mobile No..."
                value={orderDetails.mobileno}
                onChange={(e) =>
                  setOrderDetails({ ...orderDetails, mobileno: e.target.value })
                }
                required
                className="w-full p-2 border border-gray-300 rounded mt-1 mb-3"
              />
            </div>
            <h2 className="text-xl font-bold mb-4">Update Order Address</h2>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Street:</label>
              <Input
                type="text"
                value={orderAddress.street}
                onChange={(e) =>
                  setOrderAddress((prev) => ({
                    ...prev,
                    street: e.target.value,
                  }))
                }
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Landmark:</label>
              <Input
                type="text"
                value={orderAddress.landmark}
                onChange={(e) =>
                  setOrderAddress((prev) => ({
                    ...prev,
                    landmark: e.target.value,
                  }))
                }
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">City:</label>
              <Input
                type="text"
                value={orderAddress.city}
                onChange={(e) =>
                  setOrderAddress((prev) => ({
                    ...prev,
                    city: e.target.value,
                  }))
                }
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Postal Code:</label>
              <Input
                type="text"
                value={orderAddress.postalCode}
                onChange={(e) =>
                  setOrderAddress((prev) => ({
                    ...prev,
                    postalCode: e.target.value,
                  }))
                }
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="flex justify-end">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                onClick={() => setSelectedOrder(null)}
              >
                Cancel
              </button>
              <button
                className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded"
                onClick={() => updateOrder(selectedOrder._id)}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
