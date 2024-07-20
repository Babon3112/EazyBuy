"use client";
import { useSelector, useDispatch } from "react-redux";
import Navbar from "@/components/user/Navbar";
import Announcements from "@/components/user/Announcements";
import Footer from "@/components/user/Footer";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
} from "@/lib/cartRedux";
import { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";

const CartPage: React.FC = () => {
  const [userCart, setUserCart] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const user = session?.user;
  const router = useRouter();
  const dispatch = useDispatch();

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

  const createOrder = useCallback(() => {
    user ? router.push("/order") : router.push("/signin");
  }, [router, user]);

  const handleIncrement = useCallback(
    async (productId: string, color: string, size: string) => {
      if (session) {
        try {
          const response = await axios.post("/api/users/cart/increment-item", {
            productId,
            color,
            size,
          });
          setUserCart(response.data.cart);
        } catch (error) {
          console.error("Failed to increment item", error);
        }
      } else {
        dispatch(incrementQuantity({ productId, color, size }));
      }
    },
    [session, dispatch]
  );

  const handleDecrement = useCallback(
    async (productId: string, color: string, size: string) => {
      if (session) {
        try {
          const response = await axios.post("/api/users/cart/decrement-item", {
            productId,
            color,
            size,
          });
          setUserCart(response.data.cart);
        } catch (error) {
          console.error("Failed to decrement item", error);
        }
      } else {
        dispatch(decrementQuantity({ productId, color, size }));
      }
    },
    [session, dispatch]
  );

  const handleDelete = useCallback(
    async (_id: string, productId: string, color: string, size: string) => {
      if (session) {
        try {
          const response = await axios.post("/api/users/cart/remove-item", {
            productId: _id,
          });
          setUserCart(response.data.cart);
        } catch (error) {
          console.error("Failed to remove item", error);
        }
      } else {
        dispatch(removeFromCart({ productId, color, size }));
      }
    },
    [session, dispatch]
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl">
        <Loader2 className="animate-spin" />
        Loading...
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <Announcements />
      <Navbar />
      <div className="p-5 bg-white rounded-lg shadow-md mx-auto tablet:w-3/5 w-5/6 my-10">
        <h1 className="font-semibold text-center text-2xl text-gray-800 mb-8">
          Your Bag
        </h1>
        <div className="flex p-5 items-center justify-between border-b border-gray-300">
          <Link
            className="px-5 py-2 font-semibold cursor-pointer rounded bg-transparent text-black hover:bg-teal-200 transition-all"
            href={"/"}
          >
            Continue Shopping
          </Link>
          <span className="hidden tablet:inline text-lg">
            Shopping Bag({cart?.quantity}) Your Wishlist(0)
          </span>
          <button
            className="px-5 py-2 font-semibold cursor-pointer rounded bg-teal-500 text-white hover:bg-teal-600 transition-all"
            onClick={createOrder}
          >
            Check Out Now
          </button>
        </div>
        <div className="flex flex-col tablet:flex-row justify-between mt-5">
          <div className="w-full mr-6">
            {cart?.products?.map((product: any) => (
              <div key={product.productId}>
                <div className="flex flex-col justify-center items-center mb-4 bg-gray-50 rounded-lg p-4 shadow-sm">
                  <div className="flex flex-col mobile:flex-row items-center">
                    <Link href={`/product/${product.productId}`}>
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-48 h-48 rounded-xl object-contain max-mobile:mx-auto mb-4 mobile:mb-0"
                      />
                    </Link>
                    <div className="p-5 flex flex-col justify-around">
                      <div className="text-lg font-medium">{product.brand}</div>
                      <Link
                        href={`/product/${product.productId}`}
                        className="text-xl font-semibold"
                      >
                        {product.title}
                      </Link>
                      <div className="flex space-x-4 items-center mt-2">
                        <div className="flex items-center justify-center">
                          <b className="mr-2">Color:</b>
                          <div className="font-medium">{product.color}</div>
                        </div>
                        <div className="flex items-center justify-center">
                          <b className="mr-2">Size:</b>
                          <div className="font-medium">{product.size}</div>
                        </div>
                      </div>
                      <div className="flex space-x-4 mt-2">
                        <div className="flex items-center">
                          <RemoveIcon
                            className="cursor-pointer text-gray-500 hover:text-gray-700"
                            onClick={() =>
                              handleDecrement(
                                product.productId,
                                product.color,
                                product.size
                              )
                            }
                          />
                          <div className="text-xl mx-2">{product.quantity}</div>
                          <AddIcon
                            className="cursor-pointer text-gray-500 hover:text-gray-700"
                            onClick={() =>
                              handleIncrement(
                                product.productId,
                                product.color,
                                product.size
                              )
                            }
                          />
                        </div>
                        <p className="text-2xl font-bold text-green-600">
                          ₹{product.price}
                        </p>
                        <DeleteIcon
                          className="cursor-pointer text-red-500 hover:text-red-700"
                          onClick={() =>
                            handleDelete(
                              product._id,
                              product.productId,
                              product.color,
                              product.size
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <hr className="my-4 border-gray-200" />
              </div>
            ))}
          </div>
          <div className="border border-gray-300 rounded-lg p-5 h-full tablet:w-96 bg-gray-50 shadow-sm">
            <h2 className="text-2xl font-medium mb-5">Order Summary</h2>
            <div className="mb-5 flex justify-between items-center">
              <span className="text-base">Subtotal:</span>
              <span className="text-lg"> ₹{totalAmount} </span>
            </div>
            <div className="mb-5 flex justify-between items-center">
              <span className="text-base">Shipping Charges:</span>
              <span className="text-lg">₹60</span>
            </div>
            <div className="mb-5 flex justify-between items-center">
              <span className="text-base">Shipping Discount</span>
              <span className="text-lg">-₹60</span>
            </div>
            <div className="flex justify-between items-center font-semibold">
              <span className="text-base">Total</span>
              <span className="text-lg"> ₹{totalAmount} </span>
            </div>
            <button
              className="w-full px-5 py-2 mt-5 bg-teal-500 text-white font-semibold rounded hover:bg-teal-600 transition-all"
              onClick={createOrder}
            >
              CHECKOUT NOW
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CartPage;
