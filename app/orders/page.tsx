"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import { apiFetch } from "../lib/api";

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  rowTotal: number;
}

interface Order {
  orderId: string;
  orderStatus: string;
  paymentStatus: string;
  totalAmount: number;
  orderedAt: string;
  orderItems: OrderItem[];
}

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await apiFetch("/api/Order/my-orders");
      setOrders(data);
    } catch {
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">My Orders</h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500 mb-4">No orders yet.</p>
            <button
              onClick={() => router.push("/products")}
              className="bg-gray-900 text-white px-6 py-2 rounded hover:bg-gray-700"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.orderId} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm text-gray-500">
                      {new Date(order.orderedAt).toLocaleDateString("sv-SE")}
                    </p>
                    <p className="text-sm text-gray-500 font-mono">
                      #{order.orderId.slice(0, 8)}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm mr-2">
                      {order.orderStatus}
                    </span>
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  {order.orderItems?.map((item) => (
                    <div
                      key={item.productId}
                      className="flex justify-between py-2"
                    >
                      <span className="text-gray-700">
                        {item.productName} x{item.quantity}
                      </span>
                      <span className="font-semibold">${item.rowTotal}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 flex justify-end">
                  <p className="text-lg font-bold">
                    Total: ${order.totalAmount}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}