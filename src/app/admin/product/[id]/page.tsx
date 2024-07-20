"use client";
import React, { useState, useEffect, useMemo, ChangeEvent } from "react";
import { useParams } from "next/navigation";
import PublishIcon from "@mui/icons-material/Publish";
import Chart from "@/components/admin/Chart";
import Link from "next/link";
import Navbar from "@/components/admin/Navbar";
import Sidebar from "@/components/admin/Sidebar";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

interface Product {
  _id: string;
  image: string;
  title: string;
  description: string;
  price: number;
  categories: string[];
  color: string[];
  size: string[];
  inStock: boolean;
}

export default function Product() {
  const [product, setProduct] = useState<Product | null>(null);
  const [productImage, setProductImage] = useState<File | null>(null);
  const [brand, setBrand] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [categories, setCategories] = useState<string[]>([]);
  const [color, setColor] = useState<string[]>([]);
  const [size, setSize] = useState<string[]>([]);
  const [inStock, setInStock] = useState<boolean>(true);
  const [pStats, setPStats] = useState<{ name: string; Sales: number }[]>([]);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const { id } = useParams();

  const MONTHS = useMemo(
    () => [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    []
  );

  const handleCategories = (e: ChangeEvent<HTMLInputElement>) => {
    setCategories(e.target.value.split(","));
  };

  const handleColor = (e: ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value.split(","));
  };

  const handleSize = (e: ChangeEvent<HTMLInputElement>) => {
    setSize(e.target.value.split(","));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setProductImage(file);
    }
  };

  const getProduct = async () => {
    try {
      const response = await axios.get(
        `/api/products/get-product/?productId=${id}`
      );
      setProduct(response.data.product);
      setBrand(response.data.product.brand);
      setTitle(response.data.product.title);
      setDescription(response.data.product.description);
      setPrice(response.data.product.price);
      setCategories(response.data.product.categories);
      setColor(response.data.product.color);
      setSize(response.data.product.size);
      setInStock(response.data.product.inStock);
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  useEffect(() => {
    if (id) {
      getProduct();
    }
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(productImage);

    const formData = new FormData();
    if (productImage) formData.append("image", productImage);
    if (brand) formData.append("brand", brand);
    if (title) formData.append("title", title);
    if (description) formData.append("description", description);
    if (price) formData.append("price", price.toString());
    if (categories)
      categories.forEach((category) => formData.append("categories", category));
    if (color) color.forEach((color) => formData.append("color", color));
    if (size) size.forEach((size) => formData.append("size", size));
    formData.append("inStock", inStock ? "true" : "false");
    formData.append("productId", id.toString());

    try {
      setIsUpdating(true);
      await axios.put(`/api/products/update-product`, formData).then(() => {
        toast({ title: "Product Update Successfully" });
        window.location.reload();
        setIsUpdating(false);
      });
    } catch (error) {
      setIsUpdating(false);
      console.error("Error updating product:", error);
      alert("Failed to update product");
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-4 p-5">
          <div className="flex items-center justify-between mb-5">
            <h1 className="text-2xl font-bold">Product Details</h1>
            <Link
              href="/newproduct"
              className="text-white bg-teal-500 p-2 rounded-md font-medium"
            >
              Create New Product
            </Link>
          </div>
          <div className="flex">
            <div className="flex-1">
              <Chart data={pStats} dataKey="Sales" title="Sales Performance" />
            </div>
            <div className="flex-1 p-5 m-5 shadow-md">
              <div className="flex items-center">
                <img
                  src={product?.image}
                  alt="product"
                  className="w-12 h-12 rounded-full object-contain mr-5"
                />
                <span className="font-semibold">{product?.title}</span>
              </div>
              <div className="mt-2">
                <div className="flex justify-between w-36">
                  <span className="font-medium mr-2">ID:</span>
                  <span className="font-light">{product?._id}</span>
                </div>
                <div className="flex justify-between w-36 mt-2">
                  <span className="font-medium">Total Sales:</span>
                  <span className="font-light">5123</span>
                </div>
                <div className="flex justify-between w-36 mt-2">
                  <span className="font-medium">In Stock:</span>
                  <span className="font-light">
                    {product?.inStock ? "Yes" : "No"}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="m-8 border border-gray-300 p-8 shadow-lg rounded-2xl">
            <form className="flex justify-between" onSubmit={handleUpdate}>
              <div className="flex flex-col">
                <label className="mb-2 text-gray-500">Product Brand</label>
                <input
                  type="text"
                  value={brand}
                  className="w-72 mb-2 border-b border-gray-500 p-1 outline-none"
                  onChange={(e) => setBrand(e.target.value)}
                />
                <label className="mb-2 text-gray-500">Product Name</label>
                <input
                  type="text"
                  value={title}
                  className="w-72 mb-2 border-b border-gray-500 p-1 outline-none"
                  onChange={(e) => setTitle(e.target.value)}
                />
                <label className="mb-2 text-gray-500">
                  Product Description
                </label>
                <textarea
                  value={description}
                  className="w-72 mb-2 border-b border-gray-500 p-1 h-32 outline-none"
                  onChange={(e) => setDescription(e.target.value)}
                />
                <label className="mb-2 text-gray-500">Categories</label>
                <input
                  type="text"
                  value={categories.join(",")}
                  className="w-72 mb-2 border-b border-gray-500 p-1 outline-none"
                  onChange={handleCategories}
                />
                <label className="mb-2 text-gray-500">Color</label>
                <input
                  type="text"
                  value={color.join(",")}
                  className="w-72 mb-2 border-b border-gray-500 p-1 outline-none"
                  onChange={handleColor}
                />
                <label className="mb-2 text-gray-500">Size</label>
                <input
                  type="text"
                  value={size.join(",")}
                  className="w-72 mb-2 border-b border-gray-500 p-1 outline-none"
                  onChange={handleSize}
                />
                <label className="mb-2 text-gray-500">Price</label>
                <input
                  type="number"
                  value={price}
                  className="w-72 mb-2 border-b border-gray-500 p-1 outline-none"
                  onChange={(e) => setPrice(Number(e.target.value))}
                />
                <label className="mb-2 text-gray-500">In Stock</label>
                <select
                  className="w-72 mb-2 border border-gray-500 p-1 outline-none"
                  value={inStock.toString()}
                  onChange={(e) => setInStock(e.target.value === "true")}
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
              <div className="flex flex-col items-center ml-10 mt-7 mr-6">
                {productImage ? (
                  <img
                    src={URL.createObjectURL(productImage)}
                    alt="Product"
                    className="w-96 h-96 rounded-md shadow-lg object-cover mb-10"
                  />
                ) : (
                  <img
                    src={product?.image}
                    alt="upload"
                    className="w-96 h-96 object-cover rounded-md shadow-lg mb-10"
                  />
                )}
                <div className="flex items-center">
                  <label
                    htmlFor="productImage"
                    className="flex items-center cursor-pointer text-teal-500 text-lg"
                  >
                    Change Image
                    <PublishIcon />
                  </label>
                  <input
                    id="productImage"
                    type="file"
                    accept="image/*,video/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </div>
                <button
                  className="w-36 bg-teal-500 text-white p-2 rounded-md font-semibold mt-10 hover:bg-teal-600 transition-all duration-200"
                  type="submit"
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <div className="flex">
                      <Loader2 className="animate-spin mr-2" />
                      Updating...
                    </div>
                  ) : (
                    "Update Product"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
