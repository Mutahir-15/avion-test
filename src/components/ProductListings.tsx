"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaSortDown } from "react-icons/fa6";
import { client } from "@/sanity/lib/client";
import { FAQ } from "./FAQ";

interface Product {
  image_url: string;
  _id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
}

const ProductListings = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchedProducts: Product[] = await client.fetch(
          `
          *[_type == "product"] {
            _id,
            name,
            description,
            quantity,
            price,
            dimensions,
            "image_url": image.asset->url,
          }
          `
        );
        setProducts(fetchedProducts);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <section className="max-w-[1440px] mx-auto mb-10 px-4 sm:px-6 lg:px-8">
      {/* Header Image */}
      <div>
        <Image
          src="/images/PLS1.png"
          alt="BG Image"
          width={1440}
          height={209}
          className="w-full"
        />
      </div>

      {/* Filters Section */}
      <div className="flex flex-wrap justify-between items-center gap-6 p-4 bg-gray-50 shadow-md rounded-lg">
        {/* Left Filters */}
        <div className="flex flex-wrap gap-4">
          {["Category", "Sort by", "Product type", "Price", "Brand"].map(
            (filter, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-white py-2 px-3 rounded-md shadow-sm cursor-pointer hover:bg-gray-100 transition-all"
              >
                <p className="text-gray-700 font-medium">{filter}</p>
                <FaSortDown className="text-gray-500" />
              </div>
            )
          )}
        </div>

        {/* Right Sorting */}
        <div className="flex justify-center items-center gap-3">
          <p className="text-gray-700 font-medium">Sorting by:</p>
          <div className="flex items-center gap-2 bg-white py-2 px-3 rounded-md shadow-sm cursor-pointer hover:bg-gray-100 transition-all">
            <p className="text-gray-700 font-medium">Date added</p>
            <FaSortDown className="text-gray-500" />
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 py-6">
        {products.map((product) => (
          <Link href={`/product-listings/${product._id}`} key={product._id}>
            <div className="flex flex-col items-start p-4 bg-white shadow-sm hover:shadow-md hover:scale-105 transition-transform duration-300 rounded-md">
              <div className="relative w-full h-64">
                <Image
                  src={product.image_url}
                  alt={product.name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded"
                />
              </div>
              <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
              <p className="text-gray-800 text-xl mb-2">${product.price}</p>
              <p className="text-sm text-gray-500">
                Quantity: {product.quantity || "N/A"}
              </p>
            </div>
          </Link>
        ))}
      </div>
      <FAQ />
    </section>
  );
};

export default ProductListings;
