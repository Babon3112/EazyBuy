import { useEffect, useState } from "react";
import Product from "./Product";
import axios from "axios";

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

interface Props {
  cat?: string;
  filters: Record<string, string>;
  sort: "newest" | "asc" | "desc";
}

const Products: React.FC<Props> = () => {
  const [products, setProducts] = useState<ProductType[]>([]);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await axios.get(
          `/api/products/get-products/?new=true`
        );
        setProducts(response.data.products);
      } catch (error) {}
    };

    getProducts();
  }, []);

  return (
    <div className="flex justify-between p-4 w-screen flex-wrap">
      {products.slice(0, 8).map((product) => (
        <Product product={product} key={product._id} />
      ))}
    </div>
  );
};

export default Products;
