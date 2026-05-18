"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center">
      <Link href="/products" className="text-xl font-bold">
        🛒 EcommerceApi
      </Link>
      <div className="flex gap-6">
        <Link href="/categories" className="hover:text-gray-300">Categories</Link>
        <Link href="/products" className="hover:text-gray-300">Products</Link>
        <Link href="/cart" className="hover:text-gray-300">Cart</Link>
        <Link href="/orders" className="hover:text-gray-300">My Orders</Link>
        <button onClick={logout} className="hover:text-red-400">Logout</button>
      </div>
    </nav>
  );
}