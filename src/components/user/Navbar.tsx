"use client";
import React, { useEffect, useRef, useState } from "react";
import { Badge } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartTwoToneIcon from "@mui/icons-material/ShoppingCartTwoTone";
import LogoutIcon from "@mui/icons-material/Logout";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FavoriteTwoTone } from "@mui/icons-material";

const Navbar = () => {
  const stateCartQuantity = useSelector(
    (state: any) => state.cart.products.length
  );
  const [userCartQuantity, setUserCartQuantity] = useState<any | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [keywords, setKeywords] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { data: session } = useSession();
  const username = session?.user.username;

  useEffect(() => {
    const getCart = async () => {
      if (session) {
        try {
          const response = await axios.get("/api/users/cart/get-cart");
          setUserCartQuantity(response.data.cart.quantity);
        } catch (error) {
          console.error("Failed to fetch cart", error);
        }
      }
    };
    getCart();
  }, [session]);

  const searchItems = (e: any) => {
    e.preventDefault();
    router.push(`/products/${keywords}`);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="h-15 bg-gray-200 border-b border-gray-300">
      <div className="flex items-center py-2 px-5">
        <div className="flex items-center w-1/3">
          <span className="text-sm hidden mobile:block cursor-pointer text-gray-600 mr-5">
            EN
          </span>
          <form
            className="flex items-center border border-gray-400 bg-white rounded py-1 px-2"
            onSubmit={searchItems}
          >
            <input
              className="border-none outline-none text-sm bg-white w-full placeholder-gray-700"
              placeholder="Search"
              id="search"
              onChange={(e) => setKeywords(e.target.value)}
            />
            <button type="submit">
              <SearchIcon style={{ color: "gray", fontSize: 16 }} />
            </button>
          </form>
        </div>
        <h1 className="w-1/3 text-center font-bold text-gray-800 text-xl mobile:text-3xl font-serif">
          EazyBuy.
        </h1>
        <div className="flex items-center justify-end space-x-4 w-1/3">
          {session?.user && (
            <Link
              href="/wishlist"
              className="cursor-pointer text-gray-600 transition-colors hover:text-gray-800"
            >
              <FavoriteTwoTone />
            </Link>
          )}
          <Link
            href="/cart"
            className="cursor-pointer text-gray-600 transition-colors hover:text-gray-800"
          >
            <Badge
              badgeContent={session ? userCartQuantity : stateCartQuantity}
              color="primary"
            >
              <ShoppingCartTwoToneIcon />
            </Badge>
          </Link>
          {session?.user ? (
            <div ref={dropdownRef}>
              <div
                className="flex items-center text-sm cursor-pointer font-medium text-gray-600 transition-colors hover:text-gray-800"
                onClick={toggleDropdown}
              >
                <img
                  className="w-10 h-10 rounded-full mx-2 object-cover"
                  src={
                    session?.user.avatar ||
                    "https://res.cloudinary.com/arnabcloudinary/image/upload/v1713427478/EazyBuy/Avatar/no-avatar.png"
                  }
                  alt="User Avatar"
                />
              </div>
              {isDropdownOpen && (
                <div className="absolute top-24 right-1 bg-white border border-gray-300 rounded shadow-md z-10">
                  <Link
                    href={`/your-account/${username}`}
                    className="flex justify-center items-center p-2 cursor-pointer hover:bg-gray-200"
                  >
                    Your Account
                  </Link>
                  <Link
                    href={`/change-password/${username}`}
                    className="flex justify-center items-center p-2 cursor-pointer hover:bg-gray-200"
                  >
                    Change password
                  </Link>
                  <Link
                    href={`/delete-account/${username}`}
                    className="flex justify-center items-center p-2 cursor-pointer hover:bg-gray-200"
                  >
                    Delete account
                  </Link>
                  <Link
                    href="/your-orders"
                    className="flex justify-center items-center p-2 cursor-pointer hover:bg-gray-200"
                  >
                    your orders
                  </Link>
                  {session.user.isAdmin && (
                    <Link
                      href="/admin"
                      className="flex justify-center items-center p-2 cursor-pointer hover:bg-gray-200"
                    >
                      Admin Page
                    </Link>
                  )}
                  <div
                    onClick={() => signOut()}
                    className="flex justify-center items-center p-2 cursor-pointer hover:bg-gray-200"
                  >
                    Logout
                    <LogoutIcon />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/signup"
                className="text-sm cursor-pointer font-medium text-gray-600 transition-colors ml-6 hover:text-gray-800"
              >
                SIGN UP
              </Link>
              <Link
                href="/signin"
                className="text-sm cursor-pointer font-medium text-gray-600 transition-colors ml-6 hover:text-gray-800"
              >
                SIGN IN
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
