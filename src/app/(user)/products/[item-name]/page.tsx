"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/user/Navbar";
import Announcements from "@/components/user/Announcements";
import NewsLetter from "@/components/user/NewsLetter";
import Footer from "@/components/user/Footer";
import axios from "axios";
import Product from "@/components/user/Product";

type SortType = "newest" | "asc" | "desc";
interface ProductType {
  _id: string;
  brand: string;
  title: string;
  description: string;
  price: number;
  created: Date;
  image: string;
  [key: string]: any;
}

const ProductListPage: React.FC = () => {
  const cat = window.location.pathname.split("/")[2];

  const [filters, setFilters] = useState<{ [key: string]: string }>({});
  const [sort, setSort] = useState<SortType>("newest");
  const [products, setProducts] = useState<ProductType[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductType[]>([]);

  const handleFilters = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSort(e.target.value as SortType);
  };

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await axios.get(
          `/api/products/search-products/?cat=${cat.toLowerCase()}`
        );
        setProducts(response.data.products);
      } catch (error) {}
    };

    getProducts();
  }, [cat]);

  useEffect(() => {
    setFilteredProducts(
      products.filter((product) =>
        Object.entries(filters).every(([key, value]) =>
          product[key].includes(value.toLowerCase())
        )
      )
    );
  }, [products, cat, filters]);

  useEffect(() => {
    if (sort === "newest") {
      setFilteredProducts((prev) =>
        [...prev].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      );
    } else if (sort === "asc") {
      setFilteredProducts((prev) =>
        [...prev].sort((a, b) => a.price - b.price)
      );
    } else {
      setFilteredProducts((prev) =>
        [...prev].sort((a, b) => b.price - a.price)
      );
    }
  }, [sort]);

  return (
    <div className="bg-gray-100 min-h-screen">
      <Announcements />
      <Navbar />
      <div className="p-5 bg-white rounded-lg shadow-md mobile:w-5/6 my-10 mx-6 mobile:mx-auto">
        <div className="flex items-center">
          <p className="text-lg font-medium">Searched Products:</p>
          <h1 className="ml-4 text-gray-800 text-2xl font-semibold capitalize">
            {cat}
          </h1>
        </div>
        <div className="flex flex-col mobile:flex-row justify-between mb-2">
          <div className="m-5 bg-gray-100 p-4 rounded-md shadow-md">
            <span className="text-lg font-semibold text-gray-600 mr-5">
              Filter Products:
            </span>
            <select
              name="color"
              onChange={handleFilters}
              className="p-2 mr-5 border border-gray-300 rounded-md"
            >
              <option disabled selected>
                Color
              </option>
              <option>White</option>
              <option>Black</option>
              <option>Red</option>
              <option>Blue</option>
              <option>Green</option>
              <option>Yellow</option>
            </select>
            {/* <select
            name="size"
            onChange={handleFilters}
            className="p-2 border border-gray-300 rounded-md"
          >
            <option disabled selected>
              Size
            </option>
            <option>XS</option>
            <option>S</option>
            <option>M</option>
            <option>L</option>
            <option>XL</option>
          </select> */}
          </div>
          <div className="m-5 bg-gray-100 p-4 rounded-md shadow-md">
            <span className="text-lg font-semibold text-gray-600 mr-5">
              Sort Products:
            </span>
            <select
              onChange={handleSort}
              className="p-2 border border-gray-300 rounded-md"
            >
              <option value="newest" selected>
                Newest
              </option>
              <option value="asc">Price: Low To High</option>
              <option value="desc">Price: High To Low</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 mobile:grid-cols-2 laptop:grid-cols-4">
          {filteredProducts.map((product) => (
            <div className="flex p-4" key={product._id}>
              <Product product={product} key={product._id} />
            </div>
          ))}
        </div>
      </div>
      <NewsLetter />
      <Footer />
    </div>
  );
};

export default ProductListPage;
