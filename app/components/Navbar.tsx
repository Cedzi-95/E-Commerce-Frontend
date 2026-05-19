"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    router.push("/products");
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center">
      <Link href="/products" className="text-xl font-bold">
       <h1>🛒 Cedzi-Commerce</h1> 
      </Link>
      <div className="flex gap-6">
        <Link href="/categories" className="hover:text-gray-300">Categories</Link>
        <Link href="/products" className="hover:text-gray-300">Products</Link>
        {isLoggedIn ? (
          <>
            <Link href="/cart" className="hover:text-gray-300">Cart</Link>
            <Link href="/orders" className="hover:text-gray-300">My Orders</Link>
            <button onClick={logout} className="hover:text-red-400">Logout</button>
          </>
        ) : (
          <Link href="/login" className="hover:text-gray-300">Login</Link>
        )}
      </div>
    </nav>
  );
}