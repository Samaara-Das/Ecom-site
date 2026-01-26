"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";

interface ProductVariant {
  id: string;
  title: string;
  prices: Array<{
    amount: number;
    currency_code: string;
  }>;
}

interface Product {
  id: string;
  title: string;
  description: string | null;
  thumbnail: string | null;
  handle: string;
  variants: ProductVariant[];
  images?: Array<{
    id: string;
    url: string;
  }>;
}

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;
  const { addItem } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";
        const response = await fetch(`${backendUrl}/store/products/${productId}`, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Product not found");
          }
          throw new Error("Failed to fetch product");
        }

        const data = await response.json();
        setProduct(data.product);
        if (data.product?.variants?.length > 0) {
          setSelectedVariant(data.product.variants[0]);
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(err instanceof Error ? err.message : "Failed to load product");
      } finally {
        setLoading(false);
      }
    }

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleAddToCart = () => {
    if (!product || !selectedVariant) return;

    const price = selectedVariant.prices?.[0]?.amount || 0;
    addItem({
      id: product.id,
      title: product.title,
      thumbnail: product.thumbnail,
      price,
      variantId: selectedVariant.id,
    });
  };

  const formatPrice = (amount: number, currencyCode: string = "KWD") => {
    return new Intl.NumberFormat("en-KW", {
      style: "currency",
      currency: currencyCode,
    }).format(amount / 100);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <CartDrawer />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="aspect-square bg-gray-200 rounded-lg" />
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4" />
                <div className="h-6 bg-gray-200 rounded w-1/4" />
                <div className="h-24 bg-gray-200 rounded" />
                <div className="h-12 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <CartDrawer />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">
              {error === "Product not found" ? "Product Not Found" : "Error Loading Product"}
            </h1>
            <p className="text-muted-foreground mb-6">
              {error || "The product you're looking for doesn't exist."}
            </p>
            <Link href="/">
              <Button>Back to Home</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const currentPrice = selectedVariant?.prices?.[0];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <CartDrawer />

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
            <li>
              <Link href="/" className="hover:text-primary">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/" className="hover:text-primary">
                Products
              </Link>
            </li>
            <li>/</li>
            <li className="text-foreground font-medium" aria-current="page">
              {product.title}
            </li>
          </ol>
        </nav>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image */}
          <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
            {product.thumbnail ? (
              <Image
                src={product.thumbnail}
                alt={product.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center text-gray-400">
                <svg
                  className="h-24 w-24"
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

          {/* Product Info */}
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold mb-4" data-testid="product-title">
              {product.title}
            </h1>

            {currentPrice && (
              <p className="text-2xl font-bold text-primary mb-4" data-testid="product-price">
                {formatPrice(currentPrice.amount, currentPrice.currency_code)}
              </p>
            )}

            {product.description && (
              <div className="prose prose-gray max-w-none mb-6" data-testid="product-description">
                <p className="text-muted-foreground">{product.description}</p>
              </div>
            )}

            {/* Variant Selection */}
            {product.variants && product.variants.length > 1 && (
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Select Variant
                </label>
                <select
                  value={selectedVariant?.id || ""}
                  onChange={(e) => {
                    const variant = product.variants.find(v => v.id === e.target.value);
                    if (variant) setSelectedVariant(variant);
                  }}
                  className="w-full md:w-auto px-4 py-2 border rounded-md"
                  data-testid="variant-selector"
                >
                  {product.variants.map((variant) => (
                    <option key={variant.id} value={variant.id}>
                      {variant.title || `Variant ${variant.id}`}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="mt-auto space-y-4">
              <Button
                onClick={handleAddToCart}
                size="lg"
                className="w-full md:w-auto"
                data-testid="add-to-cart-button"
              >
                Add to Cart
              </Button>

              <Link href="/" className="block">
                <Button variant="outline" className="w-full md:w-auto">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
