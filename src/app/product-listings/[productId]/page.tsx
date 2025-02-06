import { groq } from "next-sanity";
import { client } from "@/sanity/lib/client";
import Image from "next/image";

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

// Define the Params type
interface Params {
  productId: string;
}

// Define the Props type
interface Props {
  params: Params;
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

export default async function ProductDetails({ params }: Props) {
  // Fetch the product data
  const product: Product = await client.fetch(query, { productId: params.productId });

  // Handle missing product
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

// Generate static paths for all products
export async function generateStaticParams() {
  const query = groq`
    *[_type == "product"] {
      _id
    }
  `;
  const products: Product[] = await client.fetch(query);

  return products.map((product) => ({
    productId: product._id,
  }));
}