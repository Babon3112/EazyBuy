"use client";
import { useSelector } from "react-redux";
import { useSession } from "next-auth/react";
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import Navbar from "@/components/user/Navbar";
import Announcements from "@/components/user/Announcements";
import Footer from "@/components/user/Footer";
import NewsLetter from "@/components/user/NewsLetter";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";

const CartPage: React.FC = () => {
  const [userCart, setUserCart] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  const [details, setDetails] = useState({
    name: "",
    email: "",
    mobileno: "",
  });
  const [address, setAddress] = useState({
    street: "",
    landmark: "",
    city: "",
    postalCode: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("");
  const router = useRouter();

  useEffect(() => {
    const getCart = async () => {
      if (session) {
        try {
          const response = await axios.get("/api/users/cart/get-cart");
          setUserCart(response.data.cart);
        } catch (error) {
          console.error("Failed to fetch cart", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    getCart();
  }, [session]);

  const stateCart = useSelector((state: any) => state.cart);
  const cart = session ? userCart : stateCart;

  const totalAmount = useMemo(() => {
    return cart?.products.reduce(
      (acc: number, product: any) => acc + product.price,
      0
    );
  }, [cart]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await axios
        .post("/api/users/orders/create-order", {
          details,
          products: userCart.products,
          amount: totalAmount,
          address,
          paymentMethod,
        })
        .finally(() => {
          setIsLoading(false);
          router.push("/your-orders");
        });
    } catch (error) {
      console.error("Failed to create order", error);
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl">
        <Loader2 className="animate-spin mr-2" />
        Loading...
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <Announcements />
      <Navbar />
      <div className="p-5 bg-white rounded-lg shadow-md mx-auto tablet:w-3/5 w-5/6 my-10">
        <h1 className="font-semibold text-center text-gray-800 mb-4 text-xl">
          Place your order
        </h1>
        <div className="flex flex-col tablet:flex-row justify-between mt-5">
          <div className="w-full mr-6">
            {cart?.products?.map((product: any) => (
              <div key={product.productId} className="mb-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-20 h-20 object-contain rounded-full shadow-md"
                  />
                  <div className="flex flex-col">
                    <p className="font-semibold text-lg">{product.title}</p>
                    <p className="text-gray-600">Color: {product.color}</p>
                    <p className="text-gray-600">Size: {product.size}</p>
                    <div className="flex space-x-4 mt-2 text-gray-600">
                      <p>Quantity: {product.quantity}</p>
                      <p>Price: ₹{product.price}</p>
                    </div>
                  </div>
                </div>
                <hr className="my-4 border-gray-200" />
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-between mb-4">
          <p className="font-semibold">Total Amount of your order:</p>
          <p className="text-xl font-bold text-green-600">₹{totalAmount}</p>
        </div>
        <form onSubmit={handleSubmit}>
          <label className="block font-semibold mb-2">Details:</label>
          <Input
            type="text"
            placeholder="Full name..."
            value={details.name}
            onChange={(e) => setDetails({ ...details, name: e.target.value })}
            required
            className="w-full p-2 border border-gray-300 rounded mt-1 mb-3"
          />
          <Input
            type="email"
            placeholder="Email..."
            value={details.email}
            onChange={(e) => setDetails({ ...details, email: e.target.value })}
            required
            className="w-full p-2 border border-gray-300 rounded mt-1 mb-3"
          />
          <Input
            type="number"
            placeholder="Mobile No..."
            value={details.mobileno}
            onChange={(e) =>
              setDetails({ ...details, mobileno: e.target.value })
            }
            required
            className="w-full p-2 border border-gray-300 rounded mt-1 mb-3"
          />
          <div>
            <label className="block font-semibold mb-2">Address:</label>
            <Input
              type="text"
              placeholder="Street"
              value={address.street}
              onChange={(e) =>
                setAddress({ ...address, street: e.target.value })
              }
              required
              className="w-full p-2 border border-gray-300 rounded mt-1 mb-3"
            />
            <Input
              type="text"
              placeholder="Landmark"
              value={address.landmark}
              onChange={(e) =>
                setAddress({ ...address, landmark: e.target.value })
              }
              required
              className="w-full p-2 border border-gray-300 rounded mt-1 mb-3"
            />
            <Input
              type="text"
              placeholder="City"
              value={address.city}
              onChange={(e) => setAddress({ ...address, city: e.target.value })}
              required
              className="w-full p-2 border border-gray-300 rounded mt-1 mb-3"
            />
            <Input
              type="number"
              placeholder="Postal Code"
              value={address.postalCode}
              onChange={(e) =>
                setAddress({ ...address, postalCode: e.target.value })
              }
              required
              className="w-full p-2 border border-gray-300 rounded mt-1 mb-3"
            />
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-2">Payment:</label>
            <div className="flex items-center mb-2">
              <input
                type="radio"
                id="cashOnDelivery"
                name="paymentMethod"
                value="cashOnDelivery"
                checked={paymentMethod === "cashOnDelivery"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-2 h-4 w-4"
              />
              <label htmlFor="cashOnDelivery">Cash on Delivery</label>
            </div>
            <div className="flex items-center mb-2">
              <input
                type="radio"
                id="card"
                name="paymentMethod"
                value="card"
                checked={paymentMethod === "card"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-2 h-4 w-4"
              />
              <label htmlFor="card">Card</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="online"
                name="paymentMethod"
                value="online"
                checked={paymentMethod === "online"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-2 h-4 w-4"
              />
              <label htmlFor="online">Online</label>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-teal-500 text-white py-2 px-4 rounded hover:bg-teal-600"
          >
            {isLoading ? (
              <div className="flex justify-center items-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating order
              </div>
            ) : (
              "Place Order"
            )}
          </button>
        </form>
      </div>
      <NewsLetter />
      <Footer />
    </div>
  );
};

export default CartPage;
