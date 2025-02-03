"use client"; 
import { Product } from "@/types/types";
import { useState } from "react";

export default function AddToCart({ product }: { product: Product }) {
  const [cart, setCart] = useState<Product[]>([]);

  const addToCart = () => {
    // Check if the product is already in the cart
    const existingProduct = cart.find((item) => item.id === product.id);

    if (existingProduct) {
      // If the product is already in the cart, increase its quantity
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        )
      );
    } else {
      // If the product is not in the cart, add it with a quantity of 1
      setCart([...cart, { ...product, quantity: 1 }]);
    }

    alert(`${product.name} added to cart!`);
  };

  return (
    <div>
      <button
        onClick={addToCart}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Add to Cart
      </button>
      <div className="mt-4">
        <h3 className="font-bold">Cart Items: {cart.length}</h3>
        <ul>
          {cart.map((item) => (
            <li key={item.id}>
              {item.name} - ${item.price} (Quantity: {item.quantity || 1})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
