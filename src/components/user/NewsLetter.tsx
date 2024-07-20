import React from "react";
import SendTwoToneIcon from "@mui/icons-material/SendTwoTone";

const NewsLetter = () => {
  return (
    <div className="h-96 mobile:h-[30rem] tablet:h-[60vh] bg-[#fcf5f5] flex flex-col items-center justify-center">
      <h1 className="text-5xl mobile:text-7xl mb-8 text-[#333] font-extrabold">
        NewsLetter
      </h1>
      <div className="text-xl font-light mb-8 text-center">
        Get timely updates from your products
      </div>
      <div className="w-80 mobile:w-[40rem] tablet:w-[50rem] h-14 mobile:h-16 bg-white flex justify-between border border-gray-300 rounded-2xl">
        <input
          className="border-none flex-9 w-full p-4 text-2xl focus:outline-none"
          placeholder="Your email"
          id="send-mesage"
        />
        <button className="w-20 h-full cursor-pointer border-none bg-teal-500 text-white rounded-r-xl">
          <SendTwoToneIcon fontSize={"large"} />
        </button>
      </div>
    </div>
  );
};

export default NewsLetter;
