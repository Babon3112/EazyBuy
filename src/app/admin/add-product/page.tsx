"use client";
import Navbar from "@/components/admin/Navbar";
import Sidebar from "@/components/admin/Sidebar";
import { toast } from "@/components/ui/use-toast";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, ChangeEvent, FormEvent } from "react";

const NewProduct: React.FC = () => {
  const [productImage, setProductImage] = useState<File | null>(null);
  const [inputs, setInputs] = useState<{ [key: string]: string }>({});
  const [description, setDescription] = useState<string>("");
  const [categories, setCategories] = useState<string[]>([]);
  const [color, setColor] = useState<string[]>([]);
  const [size, setSize] = useState<string[]>([]);
  const [inStock, setInStock] = useState<boolean>(true);
  const [isCreateing, setIsCreateing] = useState<boolean>(false);
  const router = useRouter();

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCategories = (e: ChangeEvent<HTMLInputElement>) => {
    setCategories(e.target.value.split(","));
  };

  const handleColor = (e: ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value.split(","));
  };

  const handleSize = (e: ChangeEvent<HTMLInputElement>) => {
    setSize(e.target.value.split(","));
  };

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    if (!productImage) {
      console.error("Please select an image");
      return;
    }

    const formData = new FormData();
    formData.append("productImage", productImage);
    formData.append("brand", inputs.brand);
    formData.append("title", inputs.title);
    formData.append("description", description);
    formData.append("price", inputs.price);
    categories.forEach((category) => formData.append("categories", category));
    color.forEach((color) => formData.append("color", color));
    size.forEach((size) => formData.append("size", size));
    formData.append("inStock", inStock === true ? "true" : "false");

    try {
      setIsCreateing(true);
      await axios.post("/api/products/add-product", formData).then(() => {
        toast({ title: "Product added successfully." });
        setTimeout(() => {
          router.push("/admin/product-list");
        }, 1000);
        setIsCreateing(false);
      });
    } catch (error) {
      setIsCreateing(false);
      console.error("Error creating product:", error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-4 w-[30rem] ml-10 mt-10">
          <h1 className="text-xl font-bold mb-4">New Product</h1>
          <form className="space-y-4" onSubmit={handleCreate}>
            <div className="flex flex-col space-y-2">
              <label className="text-gray-600 font-semibold">Image</label>
              <input
                type="file"
                accept="image/*,video/*"
                onChange={(e) =>
                  setProductImage(e.target.files ? e.target.files[0] : null)
                }
                className="p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="text-gray-600 font-semibold">Brand</label>
              <input
                name="brand"
                type="text"
                placeholder="Product Brand"
                onChange={handleChange}
                className="p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="text-gray-600 font-semibold">Title</label>
              <input
                name="title"
                type="text"
                placeholder="Product Name"
                onChange={handleChange}
                className="p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="text-gray-600 font-semibold">Description</label>
              <textarea
                name="description"
                placeholder="description..."
                onChange={(e) => setDescription(e.target.value)}
                className="p-2 border border-gray-300 rounded h-20"
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label className="text-gray-600 font-semibold">Categories</label>
              <input
                type="text"
                placeholder="enter product categories"
                onChange={handleCategories}
                className="p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="text-gray-600 font-semibold">Color</label>
              <input
                type="text"
                placeholder="enter product colors"
                onChange={handleColor}
                className="p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="text-gray-600 font-semibold">Size</label>
              <input
                type="text"
                placeholder="enter product sizes"
                onChange={handleSize}
                className="p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="text-gray-600 font-semibold">Price</label>
              <input
                name="price"
                type="number"
                placeholder="Price"
                onChange={handleChange}
                className="p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="text-gray-600 font-semibold">Stock</label>
              <select
                name="inStock"
                onChange={() => setInStock(!inStock)}
                className="p-2 border border-gray-300 rounded"
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={isCreateing}
              className="mt-4 py-2 px-4 bg-blue-700 text-white font-semibold rounded hover:bg-blue-800"
            >
              {isCreateing ? (
                <div className="flex">
                  <Loader2 className="mr-2 animate-spin" />
                  Creating...
                </div>
              ) : (
                "Create"
              )}
            </button>
          </form>
        </div>
        {productImage && (
          <div className="h-96 w-96 p-6 flex items-center justify-center mt-40 ml-14">
            <img
              src={URL.createObjectURL(productImage)}
              className="h-auto w-auto object-cover shadow-xl"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default NewProduct;
