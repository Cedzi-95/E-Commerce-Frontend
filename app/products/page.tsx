"use client";
import { useEffect, useState } from "react";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "../components/Navbar";
import { apiFetch } from "../lib/api";

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    stockQuantity: number;
    isAvailable: boolean;
}

function ProductsContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const categoryId = searchParams.get("category");
    const [search, setSearch] = useState("");

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [addingId, setAddingId] = useState<string | null>(null);
    const [message, setMessage] = useState("");

    const filteredProducts = products.filter(
        (p) =>
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.description.toLowerCase().includes(search.toLowerCase())
    );
    useEffect(() => {
        fetchProducts();
    }, [categoryId]);

    const [categoryName, setCategoryName] = useState<string>("");

    const fetchProducts = async () => {
        try {
            if (categoryId) {
                const category = await apiFetch(`/api/Category/${categoryId}`);
                setCategoryName(category.categoryName);
                const data = await apiFetch(`/api/Product/category/${categoryId}`);
                setProducts(data);
            } else {
                const data = await apiFetch(`/api/Product/all`);
                setProducts(data);
            }
        } catch {
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };
    const addToCart = async (productId: string) => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }
        setAddingId(productId);
        try {
            await apiFetch("/api/Cart/Add", {
                method: "POST",
                body: JSON.stringify({ productId, quantity: 1 }),
            });
            setMessage("Added to cart!");
            setTimeout(() => setMessage(""), 2000);
        } catch (err: any) {
            setMessage(err.message);
        } finally {
            setAddingId(null);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500">Loading products...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <div className="max-w-6xl mx-auto p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">
                        {categoryId ? categoryName : " Products"}
                    </h1>
                    {categoryId && (
                        <button
                            onClick={() => router.push("/products")}
                            className="text-gray-600 hover:text-gray-900 underline text-sm"
                        >
                            Show all products
                        </button>
                    )}
                </div>
                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white shadow-sm"
                    />
                </div>

                {message && (
                    <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
                        {message}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                        <div
                            key={product.id}
                            className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-md transition-shadow"
                            onClick={() => router.push(`/products/${product.id}`)}
                        >
                            <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
                            <p className="text-gray-600 mb-4 text-sm">{product.description}</p>
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-2xl font-bold">${product.price}</span>
                                <span className="text-sm text-gray-500">Stock: {product.stockQuantity}</span>
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    addToCart(product.id);
                                }}
                                disabled={addingId === product.id || !product.isAvailable}
                                className="w-full bg-gray-900 text-white py-2 rounded hover:bg-gray-700 disabled:opacity-50"
                            >
                                {addingId === product.id ? "Adding..." : "Add to Cart"}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p className="text-gray-500">Loading...</p></div>}>
      <ProductsContent />
    </Suspense>
  );
}