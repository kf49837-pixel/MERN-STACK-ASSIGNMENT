"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function IssueBookPage() {
  const router = useRouter();

  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);

  const [bookId, setBookId] = useState("");
  const [memberId, setMemberId] = useState("");

  const [loading, setLoading] = useState(true);
  const [issuing, setIssuing] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        const [booksResponse, membersResponse] = await Promise.all([
          fetch("/api/books"),
          fetch("/api/members"),
        ]);

        const booksData = await booksResponse.json();
        const membersData = await membersResponse.json();

        if (!booksResponse.ok || !booksData.success) {
          throw new Error(
            booksData.message || "Failed to fetch books"
          );
        }

        if (!membersResponse.ok || !membersData.success) {
          throw new Error(
            membersData.message || "Failed to fetch members"
          );
        }

        setBooks(booksData.books);
        setMembers(membersData.members);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const availableBooks = books.filter(
    (book) => book.availableQuantity > 0
  );

  const handleSubmit = async (event) => {
    event.preventDefault();

    setIssuing(true);
    setError("");
    setMessage("");

    try {
      if (!bookId || !memberId) {
        throw new Error("Please select a book and a member");
      }

      const response = await fetch("/api/transactions/issue", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookId,
          memberId,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to issue book"
        );
      }

      setMessage("Book issued successfully!");

      setBookId("");
      setMemberId("");

      setTimeout(() => {
        router.push("/transactions");
      }, 1000);
    } catch (error) {
      setError(error.message);
    } finally {
      setIssuing(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-8 text-white md:px-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="text-sm text-blue-400 hover:text-blue-300"
          >
            ← Back to Dashboard
          </Link>

          <p className="mt-6 text-sm font-medium uppercase tracking-[0.25em] text-blue-400">
            Library Management
          </p>

          <h1 className="mt-2 text-3xl font-bold md:text-4xl">
            Issue Book
          </h1>

          <p className="mt-2 text-slate-400">
            Issue an available book to a library member.
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

          {loading ? (
            <div className="py-10 text-center text-slate-400">
              Loading books and members...
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Select Book
                </label>

                <select
                  value={bookId}
                  onChange={(event) => setBookId(event.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
                >
                  <option value="">Choose a book</option>

                  {availableBooks.map((book) => (
                    <option key={book._id} value={book._id}>
                      {book.title} — Available: {book.availableQuantity}
                    </option>
                  ))}
                </select>

                {availableBooks.length === 0 && (
                  <p className="mt-2 text-sm text-red-400">
                    No books are currently available.
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Select Member
                </label>

                <select
                  value={memberId}
                  onChange={(event) => setMemberId(event.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
                >
                  <option value="">Choose a member</option>

                  {members.map((member) => (
                    <option key={member._id} value={member._id}>
                      {member.name} — {member.email}
                    </option>
                  ))}
                </select>

                {members.length === 0 && (
                  <p className="mt-2 text-sm text-red-400">
                    No members found. Please add a member first.
                  </p>
                )}
              </div>

              <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-5">
                <p className="text-sm text-slate-400">
                  When you issue a book, its available quantity will
                  automatically decrease by 1.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <Link
                  href="/dashboard"
                  className="rounded-xl border border-slate-700 px-6 py-3 text-center font-semibold text-slate-300 transition hover:bg-slate-800"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  disabled={
                    issuing ||
                    loading ||
                    availableBooks.length === 0 ||
                    members.length === 0
                  }
                  className="rounded-xl bg-blue-600 px-6 py-3 font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {issuing ? "Issuing Book..." : "Issue Book"}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </main>
  );
}