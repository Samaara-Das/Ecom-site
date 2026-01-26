"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "./ProductCard";

interface Product {
  id: string;
  title: string;
  thumbnail: string | null;
  variants: Array<{
    id: string;
    prices: Array<{
      amount: number;
      currency_code: string;
    }>;
  }>;
}

interface ProductGridProps {
  initialProducts?: Product[];
}

// Mock products for development/testing when backend is unavailable
const MOCK_PRODUCTS: Product[] = [
  {
    id: "prod_mock_1",
    title: "Premium Wireless Headphones",
    thumbnail: "https://picsum.photos/seed/headphones/400/400",
    variants: [{ id: "var_1", prices: [{ amount: 7500, currency_code: "KWD" }] }],
  },
  {
    id: "prod_mock_2",
    title: "Smart Watch Pro",
    thumbnail: "https://picsum.photos/seed/watch/400/400",
    variants: [{ id: "var_2", prices: [{ amount: 12000, currency_code: "KWD" }] }],
  },
  {
    id: "prod_mock_3",
    title: "Portable Bluetooth Speaker",
    thumbnail: "https://picsum.photos/seed/speaker/400/400",
    variants: [{ id: "var_3", prices: [{ amount: 4500, currency_code: "KWD" }] }],
  },
  {
    id: "prod_mock_4",
    title: "Laptop Stand Aluminum",
    thumbnail: "https://picsum.photos/seed/laptop/400/400",
    variants: [{ id: "var_4", prices: [{ amount: 2500, currency_code: "KWD" }] }],
  },
];

export function ProductGrid({ initialProducts }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts || []);
  const [loading, setLoading] = useState(!initialProducts);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialProducts) return;

    async function fetchProducts() {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";
        const response = await fetch(`${backendUrl}/store/products`, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();
        setProducts(data.products || []);
      } catch (err) {
        console.error("Error fetching products:", err);
        // Use mock products when backend is unavailable (development/testing)
        console.log("Using mock products for development/testing");
        setProducts(MOCK_PRODUCTS);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [initialProducts]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse rounded-lg bg-gray-200 aspect-[3/4]"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="text-primary underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="mx-auto h-16 w-16 text-gray-300 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
        <p className="text-muted-foreground">No products available yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {products.map((product) => {
        const price = product.variants?.[0]?.prices?.[0]?.amount || 0;
        return (
          <ProductCard
            key={product.id}
            id={product.id}
            title={product.title}
            thumbnail={product.thumbnail}
            price={price}
          />
        );
      })}
    </div>
  );
}
