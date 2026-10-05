"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function BooksPage() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchBooks() {
      try {
        setLoading(true);
        setError("");

        const params = new URLSearchParams();

        if (search.trim()) {
          params.append("search", search.trim());
        }

        if (category.trim()) {
          params.append("category", category.trim());
        }

        const query = params.toString();

        const response = await fetch(
          query ? `/api/books?${query}` : "/api/books"
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to fetch books");
        }

        setBooks(data.books || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchBooks();
  }, [search, category]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this book?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      const response = await fetch(`/api/books/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to delete book");
      }

      setBooks((currentBooks) =>
        currentBooks.filter((book) => book._id !== id)
      );
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-slate-950 px-6 py-8 text-white md:px-10">
        <div className="mx-auto max-w-7xl">

          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <Link
                href="/dashboard"
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                ? Back to Dashboard
              </Link>

              <p className="mt-6 text-sm font-medium uppercase tracking-[0.25em] text-blue-400">
                Library Management
              </p>

              <h1 className="mt-2 text-3xl font-bold md:text-4xl">
                Books
              </h1>

              <p className="mt-2 text-slate-400">
                Manage all books in the library.
              </p>
            </div>

            <Link
              href="/books/add"
              className="rounded-xl bg-blue-600 px-5 py-3 text-center font-semibold transition hover:bg-blue-500"
            >
              + Add New Book
            </Link>
          </div>

          <div className="mb-6 grid gap-4 md:grid-cols-2">
            <input
              type="text"
              placeholder="Search by title or author..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500"
            />

            <input
              type="text"
              placeholder="Filter by category..."
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500"
            />
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">
              {error}
            </div>
          )}

          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">

            <div className="border-b border-slate-800 p-6">
              <h2 className="text-xl font-bold">
                All Books
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Total books: {books.length}
              </p>
            </div>

            {loading ? (
              <div className="p-10 text-center text-slate-400">
                Loading books...
              </div>
            ) : books.length === 0 ? (
              <div className="p-10 text-center text-slate-500">
                No books found.
              </div>
            ) : (
              <div className="overflow-x-auto">

                <table className="w-full min-w-[1000px]">

                  <thead className="bg-slate-950">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                        Title
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                        Author
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                        Category
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                        ISBN
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                        Quantity
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                        Available
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                        Year
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {books.map((book) => (
                      <tr
                        key={book._id}
                        className="border-t border-slate-800"
                      >
                        <td className="px-6 py-5">
                          <p className="font-semibold text-white">
                            {book.title}
                          </p>
                        </td>

                        <td className="px-6 py-5 text-slate-300">
                          {book.author}
                        </td>

                        <td className="px-6 py-5 text-slate-300">
                          {book.category}
                        </td>

                        <td className="px-6 py-5 text-sm text-slate-400">
                          {book.ISBN}
                        </td>

                        <td className="px-6 py-5 text-slate-300">
                          {book.quantity}
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={
                              book.availableQuantity > 0
                                ? "font-semibold text-green-400"
                                : "font-semibold text-red-400"
                            }
                          >
                            {book.availableQuantity}
                          </span>
                        </td>

                        <td className="px-6 py-5 text-slate-300">
                          {book.publicationYear}
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex flex-wrap gap-2">

                            <Link
                              href={`/books/${book._id}`}
                              className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 transition hover:border-blue-500 hover:text-white"
                            >
                              View
                            </Link>

                            <Link
                              href={`/books/edit/${book._id}`}
                              className="rounded-lg bg-blue-600 px-3 py-2 text-sm transition hover:bg-blue-500"
                            >
                              Edit
                            </Link>

                            <button
                              onClick={() => handleDelete(book._id)}
                              className="rounded-lg bg-red-600 px-3 py-2 text-sm transition hover:bg-red-500"
                            >
                              Delete
                            </button>

                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>

                </table>

              </div>
            )}

          </div>

        </div>
      </main>
    </ProtectedRoute>
  );
}
