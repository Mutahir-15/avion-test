import { groq } from 'next-sanity';
import { client } from '@/sanity/lib/client';
import Image from 'next/image';

// Define the GROQ query to fetch a single product by its _id
const query = groq`
  *[_type == "product" && _id == $productId][0] {
    _id,
    name,
    description,
    price,
    quantity,
    dimensions,
    "image_url": image.asset->url,
    tags,
    features,
    category->{
      name
    }
  }
`;

// Define the type for the params object
interface PageProps {
  params: {
    productId: string;
  };
}

// Fetch and display product details
export default async function ProductDetails({ params }: PageProps) {
  const product = await client.fetch(query, { productId: params.productId });

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="max-w-[1440px] mx-auto p-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="relative w-full h-96">
          <Image
            src={product.image_url}
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
          <p className="text-gray-600">Quantity: {product.quantity || "N/A"}</p>

          {/* Category */}
          {product.category && (
            <p className="text-gray-600">Category: {product.category.name}</p>
          )}

          {/* Tags */}
          {product.tags && (
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag: string, index: number) => (
                <span
                  key={index}
                  className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Features */}
          {product.features && (
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Features</h2>
              <ul className="list-disc list-inside">
                {product.features.map((feature: string, index: number) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Dimensions */}
          {product.dimensions && (
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Dimensions</h2>
              <p>Height: {product.dimensions.height}</p>
              <p>Width: {product.dimensions.width}</p>
              <p>Depth: {product.dimensions.depth}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}