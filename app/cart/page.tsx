"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import { apiFetch } from "../lib/api";

interface CartItem {
  productId: string;
  productName: string;
  quantity: number;
}

interface Cart {
  cartId: string;
  userId: string;
  cartItems: CartItem[];
}

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [ordering, setOrdering] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const data = await apiFetch("/api/Cart/Get");
      setCart(data);
    } catch {
      setCart(null);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (productId: string) => {
    try {
      await apiFetch(`/api/Cart/remove/${productId}?quantity=1`, {
        method: "DELETE",
      });
      fetchCart();
    } catch (err: any) {
      setMessage(err.message);
    }
  };

  const placeOrder = async () => {
    setOrdering(true);
    try {
      await apiFetch("/api/Order/create", {
        method: "POST",
        body: JSON.stringify({}),
      });
      setMessage("Order placed successfully!");
      setTimeout(() => router.push("/orders"), 1500);
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setOrdering(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading cart...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

        {message && (
          <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
            {message}
          </div>
        )}

        {!cart || cart.cartItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500 mb-4">Your cart is empty.</p>
            <button
              onClick={() => router.push("/products")}
              className="bg-gray-900 text-white px-6 py-2 rounded hover:bg-gray-700"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow mb-4">
              {cart.cartItems.map((item) => (
                <div
                  key={item.productId}
                  className="flex justify-between items-center p-4 border-b last:border-0"
                >
                  <div>
                    <p className="font-semibold">{item.productName}</p>
                    <p className="text-sm text-gray-500">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={placeOrder}
              disabled={ordering}
              className="w-full bg-gray-900 text-white py-3 rounded hover:bg-gray-700 disabled:opacity-50 text-lg font-semibold"
            >
              {ordering ? "Placing order..." : "Place Order"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}