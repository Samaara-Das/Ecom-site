import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductGrid } from "@/components/product/ProductGrid";
import { CartDrawer } from "@/components/cart/CartDrawer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <CartDrawer />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary/10 to-primary/5 py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Welcome to Kuwait Marketplace
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover quality products from trusted vendors across Kuwait.
              Shop electronics, fashion, home goods, and more.
            </p>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8">Featured Products</h2>
            <ProductGrid />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
