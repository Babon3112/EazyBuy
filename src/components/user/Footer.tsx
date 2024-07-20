"use client";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import XIcon from "@mui/icons-material/X";
import YouTubeIcon from "@mui/icons-material/YouTube";
import PinterestIcon from "@mui/icons-material/Pinterest";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";

const Footer = () => {
  return (
    <div className="flex flex-col mobile:flex-row justify-between items-start p-10 bg-gray-100">
      <div className="flex-1 flex flex-col p-5">
        <h1 className="font-serif text-gray-800 text-4xl mb-5">EazyBuy.</h1>
        <p className="text-gray-600 text-base leading-7 mb-5">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae libero
          sed cumque sit nam soluta, vitae, enim expedita, alias esse voluptatem
          dolore consectetur eius! Minus ullam vel vero totam hic.
        </p>
        <div className="flex">
          <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center mr-5 transition-transform transform hover:-translate-y-1 hover:shadow-lg">
            <FacebookIcon />
          </div>
          <div className="w-10 h-10 rounded-full bg-pink-500 text-white flex items-center justify-center mr-5 transition-transform transform hover:-translate-y-1 hover:shadow-lg">
            <InstagramIcon />
          </div>
          <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center mr-5 transition-transform transform hover:-translate-y-1 hover:shadow-lg">
            <XIcon />
          </div>
          <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center mr-5 transition-transform transform hover:-translate-y-1 hover:shadow-lg">
            <YouTubeIcon />
          </div>
          <div className="w-10 h-10 rounded-full bg-red-700 text-white flex items-center justify-center transition-transform transform hover:-translate-y-1 hover:shadow-lg">
            <PinterestIcon />
          </div>
        </div>
      </div>
      <div className="flex-1 p-5">
        <h3 className="font-serif text-gray-800 text-xl mb-5">Useful Links</h3>
        <ul className="m-0 p-0 list-none flex space-x-4">
          <div>
            <li className="text-base text-gray-600 mb-2 cursor-pointer transition-colors hover:text-gray-900">
              Home
            </li>
            <li className="text-base text-gray-600 mb-2 cursor-pointer transition-colors hover:text-gray-900">
              Cart
            </li>
            <li className="text-base text-gray-600 mb-2 cursor-pointer transition-colors hover:text-gray-900">
              Men Fashion
            </li>
            <li className="text-base text-gray-600 mb-2 cursor-pointer transition-colors hover:text-gray-900">
              Women Fashion
            </li>
            <li className="text-base text-gray-600 mb-2 cursor-pointer transition-colors hover:text-gray-900">
              Accessories
            </li>
          </div>
          <div>
            <li className="text-base text-gray-600 mb-2 cursor-pointer transition-colors hover:text-gray-900">
              My Account
            </li>
            <li className="text-base text-gray-600 mb-2 cursor-pointer transition-colors hover:text-gray-900">
              Orders
            </li>
            <li className="text-base text-gray-600 mb-2 cursor-pointer transition-colors hover:text-gray-900">
              WishList
            </li>
            <li className="text-base text-gray-600 mb-2 cursor-pointer transition-colors hover:text-gray-900">
              Help
            </li>
            <li className="text-base text-gray-600 mb-2 cursor-pointer transition-colors hover:text-gray-900">
              Terms
            </li>
          </div>
        </ul>
      </div>
      <div className="flex-1 p-5">
        <h3 className="font-serif text-gray-800 text-xl mb-5">Contact</h3>
        <div className="text-base text-gray-600 mb-5 flex items-center">
          <LocationOnIcon className="mr-2" />
          Kolkata, 700000
        </div>
        <div className="text-base text-gray-600 mb-5 flex items-center">
          <PhoneIcon className="mr-2" />
          +91 1234 567 890
        </div>
        <div className="text-base text-gray-600 mb-5 flex items-center">
          <EmailIcon className="mr-2" />
          contact@eazybuy.com
        </div>
        <img src="https://i.ibb.co/Qfvn4z6/payment.png" className="w-60" />
      </div>
    </div>
  );
};

export default Footer;
