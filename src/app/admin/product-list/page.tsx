"use client";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Link from "next/link";
import Navbar from "@/components/admin/Navbar";
import Sidebar from "@/components/admin/Sidebar";
import axios from "axios";
import { useEffect, useState } from "react";

export default function ProductList() {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("/api/admin/get-all-products");
      setProducts(response.data.products);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteProduct = async (productId: string) => {
    try {
      await axios
        .post(`/api/products/delete-product`, { productId })
        .finally(() => fetchProducts());
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const columns: GridColDef[] = [
    { field: "_id", headerName: "ID", width: 250 },
    { field: "brand", headerName: "Brand", width: 100 },
    {
      field: "product",
      headerName: "Product",
      width: 250,
      renderCell: (params: any) => {
        return (
          <div className="flex items-center">
            <img
              className="w-10 h-10 rounded-full mr-4 object-cover"
              src={params.row.image}
              alt=""
            />
            {params.row.title}
          </div>
        );
      },
    },
    { field: "price", headerName: "Price", width: 100 },
    { field: "inStock", headerName: "Stock", width: 100 },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params: any) => {
        return (
          <div>
            <Link
              href={"/admin/product/" + params.row._id}
              className="bg-teal-500 text-white h-10 py-2 px-4 rounded-xl mr-5"
            >
              Edit
            </Link>
            <DeleteOutlineIcon
              className="text-red-500 cursor-pointer"
              onClick={() => deleteProduct(params.row._id)}
            />
          </div>
        );
      },
    },
  ];

  return (
    <>
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <DataGrid
            rows={products}
            columns={columns}
            getRowId={(row) => row._id}
            checkboxSelection
          />
        </div>
      </div>
    </>
  );
}
