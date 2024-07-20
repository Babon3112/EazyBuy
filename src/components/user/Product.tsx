import { Search, Favorite, ShoppingCartOutlined } from "@mui/icons-material";
import axios from "axios";
import { Heart } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ProductProps {
  product: {
    _id: string;
    image: string;
    brand: string;
    title: string;
    description: string;
    price: number;
    color?: string;
    size?: string;
  };
}

const Product: React.FC<ProductProps> = ({ product }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = window.location.pathname.split("/")[1];
  const [exists, setExists] = useState(false);
  const [favoriteToggled, setFavoriteToggled] = useState(false);

  const favorite = async () => {
    if (!session?.user) {
      router.push("/signin");
      return;
    }

    await axios.post("/api/users/wishlist/toggle-item", {
      productId: product._id,
      color: product.color?.[0],
      size: product.size?.[0],
    });

    setFavoriteToggled((prev) => !prev);
  };

  const cart = async () => {
    await axios.post("/api/users/cart/add-item", {
      productId: product._id,
      quantity: 1,
      color: product.color?.[0],
      size: product.size?.[0],
      price: product?.price!,
    });
  };

  useEffect(() => {
    if (!session?.user) return;

    const getIteminWishlist = async () => {
      const response = await axios.post(
        "/api/users/wishlist/item-already-exist",
        {
          productId: product._id,
          color: product.color?.[0],
          size: product.size?.[0],
        }
      );
      setExists(response.data.exists);
    };

    getIteminWishlist();
  }, [session, favoriteToggled, product._id, product.color, product.size]);

  return (
    <>
      {pathname === "products" ? (
        <div className="p-4 border rounded-lg shadow-lg transition-shadow duration-300 hover:shadow-xl w-80 h-[29.5rem]">
          <div className="w-72 h-72">
            <Link href={`/product/${product._id}`}>
              <img
                src={product.image}
                alt={product.title}
                className="rounded-t-xl mx-auto"
              />
            </Link>
          </div>
          <div className="p-4">
            <div className="text-gray-800 flex justify-between">
              <div>
                <Link href={`/product/${product._id}`}>
                  <p className="text-lg font-semibold">{product?.brand}</p>
                  <p className="font-bold text-2xl">{product?.title}</p>
                </Link>
              </div>
              <div
                className="shadow-md p-2 border border-[#eee] rounded-full h-10 w-10 flex items-center justify-center cursor-pointer"
                onClick={favorite}
              >
                <Heart
                  fill={exists ? "#ff0000" : "#222"}
                  size={25}
                  className={`${exists ? "text-[#ff0000]" : "text-[#222]"}`}
                />
              </div>
            </div>
            <p className="text-gray-700">{product.description}</p>
            <p className="text-xl font-bold text-green-600">₹{product.price}</p>
          </div>
        </div>
      ) : (
        <div className="my-4 mx-auto w-[27.5rem] h-[27.5rem] flex items-center justify-center bg-[#e6fcfa] relative rounded-[15px] overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="w-[25rem] h-[25rem] rounded-full bg-white absolute shadow-xl" />
          <img
            src={product.image}
            alt={product.title}
            className="h-[75%] z-10 rounded-full shadow-xl object-contain"
          />
          <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-500 cursor-pointer z-20">
            <div
              className="w-12 h-12 rounded-full bg-white flex items-center justify-center m-2 transition-transform duration-500 hover:bg-[#e9f5f5] hover:scale-110 cursor-pointer"
              onClick={cart}
            >
              <ShoppingCartOutlined />
            </div>
            <Link href={`/product/${product._id}`}>
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center m-2 transition-transform duration-500 hover:bg-[#e9f5f5] hover:scale-110 cursor-pointer">
                <Search />
              </div>
            </Link>
            <div
              className="w-12 h-12 rounded-full bg-white flex items-center justify-center m-2 transition-all duration-500 hover:bg-[#e9f5f5] hover:scale-110 cursor-pointer"
              onClick={favorite}
            >
              <Heart
                fill={exists ? "#ff0000" : "#222"}
                size={23}
                className={`${exists ? "text-[#ff0000]" : "text-[#222]"}`}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Product;
