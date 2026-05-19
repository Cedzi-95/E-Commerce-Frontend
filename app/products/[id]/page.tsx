"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Navbar from "../../components/Navbar";
import { apiFetch } from "../../lib/api";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  isAvailable: boolean;
  categoryId: string;
}

export default function ProductDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const data = await apiFetch(`/api/Product/${id}`);
      setProduct(data);
    } catch {
      router.push("/products");
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    setAdding(true);
    try {
      await apiFetch("/api/Cart/Add", {
        method: "POST",
        body: JSON.stringify({ productId: product!.id, quantity }),
      });
      setMessage("Added to cart!");
      setTimeout(() => setMessage(""), 2000);
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading product...</p>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-3xl mx-auto p-6">
        <button
          onClick={() => router.back()}
          className="text-gray-600 hover:text-gray-900 mb-6 flex items-center gap-2"
        >
          ← Back
        </button>

        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-gray-600 mb-6">{product.description}</p>

          <div className="flex justify-between items-center mb-6">
            <span className="text-4xl font-bold">${product.price}</span>
            <span className={`px-3 py-1 rounded-full text-sm ${
              product.isAvailable
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}>
              {product.isAvailable ? `In stock (${product.stockQuantity})` : "Out of stock"}
            </span>
          </div>

          {message && (
            <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
              {message}
            </div>
          )}

          <div className="flex gap-4 items-center mb-6">
            <label className="text-gray-700 font-medium">Quantity:</label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 font-bold"
              >
                -
              </button>
              <span className="w-8 text-center font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 font-bold"
              >
                +
              </button>
            </div>
          </div>

          <button
            onClick={addToCart}
            disabled={adding || !product.isAvailable}
            className="w-full bg-gray-900 text-white py-3 rounded hover:bg-gray-700 disabled:opacity-50 text-lg font-semibold"
          >
            {adding ? "Adding..." : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}