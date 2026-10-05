"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function AddMemberPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    membershipDate: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/members", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          membershipDate: formData.membershipDate || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to add member");
      }

      setMessage("Member added successfully!");

      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        membershipDate: "",
      });

      setTimeout(() => {
        router.push("/members");
      }, 1000);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-slate-950 px-6 py-8 text-white md:px-10">
        <div className="mx-auto max-w-4xl">

          <div className="mb-8">
            <Link
              href="/members"
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              ? Back to Members
            </Link>

            <p className="mt-6 text-sm font-medium uppercase tracking-[0.25em] text-blue-400">
              Library Management
            </p>

            <h1 className="mt-2 text-3xl font-bold md:text-4xl">
              Add New Member
            </h1>

            <p className="mt-2 text-slate-400">
              Register a new member in the library.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 md:p-8">

            <form onSubmit={handleSubmit} className="space-y-6">

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter member name"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter email address"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Phone
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="Enter phone number"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Address
                </label>

                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  rows="4"
                  placeholder="Enter member address"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Membership Date
                </label>

                <input
                  type="date"
                  name="membershipDate"
                  value={formData.membershipDate}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500"
                />
              </div>

              {message && (
                <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-green-300">
                  {message}
                </div>
              )}

              {error && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">
                  {error}
                </div>
              )}

              <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-xl bg-blue-600 px-6 py-3 font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Adding Member..." : "Add Member"}
                </button>

                <Link
                  href="/members"
                  className="rounded-xl border border-slate-700 px-6 py-3 text-center font-semibold text-slate-300 transition hover:border-slate-500 hover:text-white"
                >
                  Cancel
                </Link>
              </div>

            </form>

          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
