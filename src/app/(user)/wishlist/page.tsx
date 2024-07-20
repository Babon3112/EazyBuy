"use client";
import Announcements from "@/components/user/Announcements";
import Footer from "@/components/user/Footer";
import Navbar from "@/components/user/Navbar";
import NewsLetter from "@/components/user/NewsLetter";
import axios from "axios";
import { Heart } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

type Product = {
  _id: string;
  brand: string;
  image: string;
  title: string;
  color: string;
  size: string;
  price: number;
  productId: string;
};

const WishlistPage = () => {
  const { data: session } = useSession();
  const [products, setProducts] = useState<Product[]>([]);
  const [favoriteToggled, setFavoriteToggled] = useState(false);

  const favorite = async (product: Product) => {
    await axios.post("/api/users/wishlist/toggle-item", {
      productId: product.productId,
      color: product.color,
      size: product.size,
    });

    setFavoriteToggled((prev) => !prev);
  };

  useEffect(() => {
    const getWishlist = async () => {
      if (!session) return;
      try {
        const response = await axios.get("/api/users/wishlist/get-wishlist");
        setProducts(response.data.wishlist.products);
      } catch (error) {
        console.error(error);
      }
    };
    getWishlist();
  }, [session, favoriteToggled]);

  return (
    <div className="bg-gray-100 min-h-screen">
      <Announcements />
      <Navbar />
      <div className="p-5 bg-white rounded-lg shadow-md mx-auto w-5/6 my-10">
        <h1 className="text-2xl font-semibold text-center mb-6">My Wishlist</h1>
        <div className="grid grid-cols-1 mobile:grid-cols-2 tablet:grid-cols-3 laptop:grid-cols-4 gap-6 justify-center items-center">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-lg shadow-lg w-64 mx-auto flex flex-col justify-center items-center p-4"
            >
              <Link href={`/product/${product.productId}`}>
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-56 h-56 object-cover shadow-lg"
                />
              </Link>
              <div className="p-4">
                <div className="text-gray-800 flex justify-between">
                  <div>
                    <Link href={`/product/${product._id}`}>
                      <p className="text-lg font-semibold">{product?.brand}</p>
                      <p className="font-bold text-xl">{product?.title}</p>
                    </Link>
                  </div>
                  <div
                    className="shadow-md p-2 border border-[#eee] rounded-full h-10 w-10 flex items-center justify-center cursor-pointer"
                    onClick={() => favorite(product)}
                  >
                    <Heart
                      fill="#ff0000"
                      size={25}
                      className={"text-[#ff0000]"}
                    />
                  </div>
                </div>
                <div className="flex space-x-6">
                  <p className="text-gray-700 mb-2 wrap">
                    Color: {product.color}
                  </p>
                  <p className="text-gray-700 mb-2">Size: {product.size}</p>
                </div>
                <p className="text-lg font-semibold text-green-600">
                  Price: ₹{product.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <NewsLetter />
      <Footer />
    </div>
  );
};

export default WishlistPage;
