"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        userName: "",
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/user/register`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(form),
                }
            );

            if (!res.ok) throw new Error("Registration failed");

            router.push("/login");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>

                {error && (
                    <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <input
                    placeholder="Username"
                    value={form.userName}
                    onChange={(e) => setForm({ ...form, userName: e.target.value })}
                    className="w-full border p-3 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full border p-3 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full border p-3 rounded mb-6 focus:outline-none focus:ring-2 focus:ring-gray-900"
                />

                <button
                    onClick={handleRegister}
                    disabled={loading}
                    className="w-full bg-gray-900 text-white py-3 rounded hover:bg-gray-700 disabled:opacity-50"
                >
                    {loading ? "Registering..." : "Register"}
                </button>

                <p className="text-center mt-4 text-gray-600">
                    Already have an account?{" "}
                    <a href="/login" className="text-gray-900 font-semibold hover:underline">
                        Login
                    </a>
                </p>
            </div>
        </div>
    );
}