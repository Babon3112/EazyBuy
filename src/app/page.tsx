"use client";
import { useMemo } from "react";
import Announcements from "@/components/user/Announcements";
import Navbar from "@/components/user/Navbar";
import Slider from "@/components/user/Slider";
import Categories from "@/components/user/Categories";
import Products from "@/components/user/Products";
import NewsLetter from "@/components/user/NewsLetter";
import Footer from "@/components/user/Footer";

export default function Home() {
  const defaultFilters = useMemo(() => ({}), []);
  const defaultSort: "newest" | "asc" | "desc" = "newest";

  return (
    <>
      <Announcements />
      <Navbar />
      <Slider />
      <Categories />
      <Products cat={""} filters={defaultFilters} sort={defaultSort} />
      <NewsLetter />
      <Footer />
    </>
  );
}
