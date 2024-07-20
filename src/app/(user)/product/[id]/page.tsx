"use client";
import { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/user/Navbar";
import Announcements from "@/components/user/Announcements";
import NewsLetter from "@/components/user/NewsLetter";
import Footer from "@/components/user/Footer";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addToCart } from "@/lib/cartRedux";
import { Heart } from "lucide-react";

interface ProductProps {
  _id: string;
  name: string;
  image: string;
  brand: string;
  title: string;
  description: string;
  price: number;
  color?: string[];
  size?: string[];
}

const ProductPage: React.FC = () => {
  const router = useRouter();
  const { id } = useParams();
  const { data: session } = useSession();
  const user = session?.user;

  const [product, setProduct] = useState<ProductProps | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [color, setColor] = useState<string>("");
  const [size, setSize] = useState<string>("");
  const dispatch = useDispatch();

  useEffect(() => {
    const getProduct = async () => {
      try {
        const response = await axios.get(
          `/api/products/get-product/?productId=${id}`
        );
        const fetchedProduct = response.data.product;
        setProduct(fetchedProduct);
        if (fetchedProduct.color?.length) {
          setColor(fetchedProduct.color[0]);
        }
        if (fetchedProduct.size?.length) {
          setSize(fetchedProduct.size[0]);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    if (id) {
      getProduct();
    }
  }, [id]);

  const handleQuantity = useCallback((type: string) => {
    setQuantity((prevQuantity) => {
      if (type === "decrease") {
        return prevQuantity > 1 ? prevQuantity - 1 : 1;
      } else {
        return prevQuantity + 1;
      }
    });
  }, []);

  const handleClick = useCallback(async () => {
    const productId = Array.isArray(id) ? id[0] : id;

    if (user) {
      await axios.post("/api/users/cart/add-item", {
        productId,
        quantity,
        color,
        size,
        price: product?.price! * quantity,
      });
    } else if (product) {
      dispatch(addToCart({ ...product, productId, quantity, color, size }));
    }
  }, [user, id, quantity, color, size, product, dispatch]);

  const handleBuyNowClick = () => {
    if (user) {
      handleClick();
      router.push("/order");
    } else {
      router.push("/signin");
    }
  };

  const [exists, setExists] = useState(false);
  const [favoriteToggled, setFavoriteToggled] = useState(false);

  const favorite = useCallback(async () => {
    if (!session?.user) {
      router.push("/signin");
      return;
    }

    await axios.post("/api/users/wishlist/toggle-item", {
      productId: product?._id,
      color,
      size,
    });

    setFavoriteToggled((prev) => !prev);
  }, [session, product, router, size, color]);

  useEffect(() => {
    if (!session?.user || !product) return;

    const getIteminWishlist = async () => {
      const response = await axios.post(
        "/api/users/wishlist/item-already-exist",
        {
          productId: product?._id,
          color: color,
          size: size,
        }
      );
      setExists(response.data.exists);
    };

    getIteminWishlist();
  }, [session, favoriteToggled, product, color, size]);

  return (
    <div className="bg-gray-100 min-h-screen">
      <Announcements />
      <Navbar />
      <div className="p-5 bg-white rounded-xl shadow-md mx-auto w-5/6 my-10">
        <div className="mx-auto flex flex-col tablet:flex-row justify-center items-center">
          <img
            src={product?.image}
            alt={product?.title}
            className="w-96 h-96 object-contain"
          />
          <div className="p-6 md:p-12 flex flex-col">
            <div className="text-gray-800 flex justify-between">
              <div>
                <p className="text-lg font-semibold">{product?.brand}</p>
                <p className="font-bold text-3xl">{product?.title}</p>
              </div>
              <div className="shadow-md p-2 border border-[#eee] rounded-full h-10 w-10 flex items-center justify-center">
                <Heart
                  fill={exists ? "#ff0000" : "#222"}
                  size={25}
                  className={`${exists ? "text-[#ff0000]" : "text-[#222]"}`}
                  onClick={() => favorite()}
                />
              </div>
            </div>
            <p className="my-6 text-gray-600 w-full">{product?.description}</p>
            <p className="text-4xl font-bold text-green-600">
              ₹{product?.price}
            </p>
            <div className="my-8 flex w-full">
              <div className="flex items-center">
                <span className="text-xl font-medium text-gray-600">
                  Color:
                </span>
                {product?.color?.map((c) => (
                  <div
                    key={c}
                    className={`w-6 h-6 ml-2 border border-gray-400 rounded-full cursor-pointer ${
                      color === c ? "ring-[1.5px] ring-teal-500" : ""
                    }`}
                    style={{ backgroundColor: c }}
                    onClick={() => setColor(c)}
                  />
                ))}
              </div>
              <div className="flex items-center">
                <span className="ml-6 text-xl font-medium text-gray-600">
                  Size:
                </span>
                <select
                  className="ml-2 p-2 border border-gray-400"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                >
                  {product?.size?.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="w-full flex flex-col mobile:flex-row items-center">
              <div className="flex items-center font-bold mobile:mr-6 max-mobile:mb-6">
                <RemoveIcon onClick={() => handleQuantity("decrease")} />
                <div className="w-10 h-10 border border-teal-500 flex items-center justify-center mx-4 rounded-full">
                  {quantity}
                </div>
                <AddIcon onClick={() => handleQuantity("increase")} />
              </div>
              <div className="w-full flex space-x-8">
                <button
                  className="p-4 bg-teal-500 text-white font-semibold transition duration-300 ease-in-out hover:bg-teal-700"
                  onClick={handleClick}
                >
                  ADD TO CART
                </button>
                <button
                  className="p-4 bg-green-500 text-white font-semibold transition duration-300 ease-in-out hover:bg-green-700"
                  onClick={handleBuyNowClick}
                >
                  BUY NOW
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <NewsLetter />
      <Footer />
    </div>
  );
};

export default ProductPage;
