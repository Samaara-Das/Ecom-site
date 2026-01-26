"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  id: string;
  title: string;
  thumbnail: string | null;
  price: number;
  currencyCode?: string;
}

export function ProductCard({
  id,
  title,
  thumbnail,
  price,
  currencyCode = "KWD",
}: ProductCardProps) {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({
      id,
      title,
      thumbnail,
      price,
    });
  };

  const formattedPrice = new Intl.NumberFormat("en-KW", {
    style: "currency",
    currency: currencyCode,
  }).format(price / 100); // Medusa stores prices in cents

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-lg" data-testid="product-card">
      <Link href={`/products/${id}`} className="block">
        <div className="relative aspect-square bg-gray-100">
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-400">
              <svg
                className="h-12 w-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg line-clamp-2" data-testid="product-card-title">{title}</h3>
          <p className="text-xl font-bold text-primary mt-2" data-testid="product-card-price">{formattedPrice}</p>
        </CardContent>
      </Link>
      <CardFooter className="p-4 pt-0">
        <Button onClick={handleAddToCart} className="w-full" data-testid="product-card-add-to-cart">
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
