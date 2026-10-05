"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function EditBookPage({ params }) {
  const router = useRouter();

  const [bookId, setBookId] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "",
    ISBN: "",
    quantity: "",
    availableQuantity: "",
    publicationYear: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadBook = async () => {
      try {
        const { id } = await params;

        setBookId(id);

        const response = await fetch(`/api/books/${id}`);
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to fetch book");
        }

        const book = data.book;

        setFormData({
          title: book.title || "",
          author: book.author || "",
          category: book.category || "",
          ISBN: book.ISBN || "",
          quantity: book.quantity ?? "",
          availableQuantity: book.availableQuantity ?? "",
          publicationYear: book.publicationYear ?? "",
        });
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadBook();
  }, [params]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(`/api/books/${bookId}`, {
        method: "PUT",
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
        throw new Error(data.message || "Failed to update book");
      }

      setMessage("Book updated successfully!");

      setTimeout(() => {
        router.push(`/books/${bookId}`);
      }, 1000);
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-slate-400">Loading book...</p>
        </div>
      </main>
    );
  }

  if (error && !bookId) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">
            {error}
          </div>

          <Link
            href="/books"
            className="mt-6 inline-block text-blue-400 hover:text-blue-300"
          >
            ← Back to Books
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-8 text-white md:px-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <Link
            href={`/books/${bookId}`}
            className="text-sm text-blue-400 hover:text-blue-300"
          >
            ← Back to Book Details
          </Link>

          <p className="mt-6 text-sm font-medium uppercase tracking-[0.25em] text-blue-400">
            Library Management
          </p>

          <h1 className="mt-2 text-3xl font-bold md:text-4xl">
            Edit Book
          </h1>

          <p className="mt-2 text-slate-400">
            Update the information of this book.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl md:p-8"
        >
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
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Book Title
              </label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Author
              </label>

              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Category
              </label>

              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                ISBN
              </label>

              <input
                type="text"
                name="ISBN"
                value={formData.ISBN}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Publication Year
              </label>

              <input
                type="number"
                name="publicationYear"
                value={formData.publicationYear}
                onChange={handleChange}
                min="0"
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Total Quantity
              </label>

              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="0"
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Available Quantity
              </label>

              <input
                type="number"
                name="availableQuantity"
                value={formData.availableQuantity}
                onChange={handleChange}
                min="0"
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500"
              />
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Link
              href={`/books/${bookId}`}
              className="rounded-xl border border-slate-700 px-6 py-3 text-center font-semibold text-slate-300 transition hover:bg-slate-800"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-blue-600 px-6 py-3 font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Updating Book..." : "Update Book"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}