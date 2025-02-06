
"use client";
import { groq } from "next-sanity";
import { client } from "@/sanity/lib/client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

// Define the Product type
interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  image: {
    asset: {
      url: string;
    };
  };
}

// Fetch product data from Sanity
const query = groq`
  *[_type == "product" && _id == $productId][0] {
    _id,
    name,
    price,
    description,
    image {
      asset-> {
        url
      }
    }
  }
`;

export default function ProductDetails() {
  const params = useParams(); // Get the dynamic route parameters
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the product data
    const fetchProduct = async () => {
      try {
        const productId = params.productId as string;
        const productData: Product = await client.fetch(query, { productId });
        setProduct(productData);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.productId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return <div>Product not found.</div>;
  }

  return (
    <div className="max-w-[1440px] mx-auto p-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="relative w-full h-96">
          <Image
            src={product.image.asset.url}
            alt={product.name}
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
          />
        </div>

        {/* Product Details */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-gray-700">{product.description}</p>
          <p className="text-2xl font-semibold">${product.price}</p>
        </div>
      </div>
    </div>
  );
}