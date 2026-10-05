"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function BookDetailsPage({ params }) {
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const { id } = await params;

        const response = await fetch(`/api/books/${id}`);
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to fetch book");
        }

        setBook(data.book);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [params]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-slate-400">Loading book details...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-red-300">
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
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
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
              Book Details
            </h1>

            <p className="mt-2 text-slate-400">
              View complete information about this book.
            </p>
          </div>

          <Link
            href={`/books/edit/${book._id}`}
            className="rounded-xl bg-blue-600 px-5 py-3 text-center font-semibold transition hover:bg-blue-500"
          >
            Edit Book
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl md:p-8">
          <div className="mb-8 border-b border-slate-800 pb-6">
            <p className="text-sm uppercase tracking-wider text-slate-500">
              Book Title
            </p>

            <h2 className="mt-2 text-3xl font-bold text-white">
              {book.title}
            </h2>

            <p className="mt-2 text-slate-400">
              by {book.author}
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
              <p className="text-sm text-slate-500">Author</p>
              <p className="mt-2 font-semibold text-white">
                {book.author}
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
              <p className="text-sm text-slate-500">Category</p>
              <p className="mt-2 font-semibold text-blue-400">
                {book.category}
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
              <p className="text-sm text-slate-500">ISBN</p>
              <p className="mt-2 font-semibold text-white">
                {book.ISBN}
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
              <p className="text-sm text-slate-500">Publication Year</p>
              <p className="mt-2 font-semibold text-white">
                {book.publicationYear}
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
              <p className="text-sm text-slate-500">Total Quantity</p>
              <p className="mt-2 text-2xl font-bold text-white">
                {book.quantity}
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
              <p className="text-sm text-slate-500">Available Quantity</p>
              <p className="mt-2 text-2xl font-bold text-green-400">
                {book.availableQuantity}
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/books"
              className="rounded-xl border border-slate-700 px-6 py-3 text-center font-semibold text-slate-300 transition hover:bg-slate-800"
            >
              Back to Books
            </Link>

            <Link
              href={`/books/edit/${book._id}`}
              className="rounded-xl bg-blue-600 px-6 py-3 text-center font-semibold transition hover:bg-blue-500"
            >
              Edit This Book
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}