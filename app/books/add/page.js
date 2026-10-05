"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";

function AddBookContent() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "",
    ISBN: "",
    quantity: "",
    availableQuantity: "",
    publicationYear: "",
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
      const response = await fetch("/api/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          author: formData.author,
          category: formData.category,
          ISBN: formData.ISBN,
          quantity: Number(formData.quantity),
          availableQuantity: Number(formData.availableQuantity),
          publicationYear: Number(formData.publicationYear),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to add book");
      }

      setMessage("Book added successfully!");

      setFormData({
        title: "",
        author: "",
        category: "",
        ISBN: "",
        quantity: "",
        availableQuantity: "",
        publicationYear: "",
      });

      setTimeout(() => {
        router.push("/books");
      }, 1000);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-8 text-white md:px-10">
      <div className="mx-auto max-w-4xl">

        {/* Header */}
        <div className="mb-8">
          <Link
            href="/books"
            className="text-sm text-blue-400 hover:text-blue-300"
          >
            ← Back to Books
          </Link>

          <p className="mt-6 text-sm font-medium uppercase tracking-[0.25em] text-blue-400">
            Library Management
          </p>

          <h1 className="mt-2 text-3xl font-bold md:text-4xl">
            Add New Book
          </h1>

          <p className="mt-2 text-slate-400">
            Add a new book to your library collection.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl md:p-8"
        >

          {/* Messages */}
          {message && (
            <div className="mb-6 rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-green-300">
              {message}
            </div>
          )}

          {error && (
            <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">
              {error}
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2">

            {/* Title */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Book Title
              </label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter book title"
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition placeholder:text-slate-500 focus:border-blue-500"
              />
            </div>

            {/* Author */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Author
              </label>

              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                placeholder="Enter author name"
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition placeholder:text-slate-500 focus:border-blue-500"
              />
            </div>

            {/* Category */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Category
              </label>

              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="e.g. Fiction"
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition placeholder:text-slate-500 focus:border-blue-500"
              />
            </div>

            {/* ISBN */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                ISBN
              </label>

              <input
                type="text"
                name="ISBN"
                value={formData.ISBN}
                onChange={handleChange}
                placeholder="Enter ISBN"
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition placeholder:text-slate-500 focus:border-blue-500"
              />
            </div>

            {/* Publication Year */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Publication Year
              </label>

              <input
                type="number"
                name="publicationYear"
                value={formData.publicationYear}
                onChange={handleChange}
                placeholder="e.g. 1988"
                min="0"
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition placeholder:text-slate-500 focus:border-blue-500"
              />
            </div>

            {/* Quantity */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Total Quantity
              </label>

              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="e.g. 10"
                min="0"
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition placeholder:text-slate-500 focus:border-blue-500"
              />
            </div>

            {/* Available Quantity */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Available Quantity
              </label>

              <input
                type="number"
                name="availableQuantity"
                value={formData.availableQuantity}
                onChange={handleChange}
                placeholder="e.g. 10"
                min="0"
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition placeholder:text-slate-500 focus:border-blue-500"
              />
            </div>

          </div>

          {/* Buttons */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">

            <Link
              href="/books"
              className="rounded-xl border border-slate-700 px-6 py-3 text-center font-semibold text-slate-300 transition hover:bg-slate-800"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-blue-600 px-6 py-3 font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Adding Book..." : "Add Book"}
            </button>

          </div>

        </form>
      </div>
    </main>
  );
}

export default function AddBookPage() {
  return (
    <ProtectedRoute>
      <AddBookContent />
    </ProtectedRoute>
  );
}

