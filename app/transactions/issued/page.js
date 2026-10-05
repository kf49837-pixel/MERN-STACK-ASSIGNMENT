"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function IssuedBooksPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [returningId, setReturningId] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadTransactions() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/transactions");
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Failed to fetch transactions"
          );
        }

        setTransactions(data.transactions || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadTransactions();
  }, []);

  const handleReturn = async (transactionId) => {
    try {
      setReturningId(transactionId);
      setError("");
      setMessage("");

      const response = await fetch(
        `/api/transactions/${transactionId}/return`,
        {
          method: "PUT",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to return book"
        );
      }

      setMessage("Book returned successfully!");

      const refreshResponse = await fetch("/api/transactions");
      const refreshData = await refreshResponse.json();

      if (!refreshResponse.ok || !refreshData.success) {
        throw new Error(
          refreshData.message || "Failed to refresh transactions"
        );
      }

      setTransactions(refreshData.transactions || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setReturningId("");
    }
  };

  const issuedTransactions = transactions.filter(
    (transaction) => transaction.status === "issued"
  );

  const returnedTransactions = transactions.filter(
    (transaction) => transaction.status === "returned"
  );

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-8 text-white md:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <Link
              href="/dashboard"
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              ← Back to Dashboard
            </Link>

            <h1 className="mt-3 text-3xl font-bold md:text-4xl">
              Issued & Returned Books
            </h1>

            <p className="mt-2 text-slate-400">
              Track currently issued and returned books.
            </p>
          </div>

          <Link
            href="/transactions/issue"
            className="rounded-xl bg-blue-600 px-5 py-3 text-center font-semibold transition hover:bg-blue-500"
          >
            + Issue New Book
          </Link>
        </div>

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

        <div className="mb-8 grid gap-5 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">Currently Issued</p>
            <h2 className="mt-2 text-3xl font-bold text-blue-400">
              {issuedTransactions.length}
            </h2>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">Returned Books</p>
            <h2 className="mt-2 text-3xl font-bold text-green-400">
              {returnedTransactions.length}
            </h2>
          </div>
        </div>

        <section className="mb-10 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
          <div className="border-b border-slate-800 px-6 py-5">
            <h2 className="text-xl font-bold">Currently Issued</h2>
            <p className="mt-1 text-sm text-slate-400">
              Books that have not been returned yet.
            </p>
          </div>

          {loading ? (
            <div className="p-10 text-center text-slate-400">
              Loading transactions...
            </div>
          ) : issuedTransactions.length === 0 ? (
            <div className="p-10 text-center text-slate-400">
              No currently issued books.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead className="bg-slate-950">
                  <tr className="text-left text-sm text-slate-400">
                    <th className="px-6 py-4">Book</th>
                    <th className="px-6 py-4">Member</th>
                    <th className="px-6 py-4">Issue Date</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {issuedTransactions.map((transaction) => (
                    <tr
                      key={transaction._id}
                      className="border-t border-slate-800"
                    >
                      <td className="px-6 py-4 font-semibold">
                        {transaction.book?.title || "Book unavailable"}
                      </td>

                      <td className="px-6 py-4 text-slate-300">
                        {transaction.member?.name || "Member unavailable"}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-400">
                        {formatDate(transaction.issueDate)}
                      </td>

                      <td className="px-6 py-4">
                        <span className="rounded-full bg-yellow-500/10 px-3 py-1 text-xs font-semibold text-yellow-400">
                          Issued
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <button
                          type="button"
                          onClick={() => handleReturn(transaction._id)}
                          disabled={returningId === transaction._id}
                          className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold transition hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {returningId === transaction._id
                            ? "Returning..."
                            : "Return Book"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
          <div className="border-b border-slate-800 px-6 py-5">
            <h2 className="text-xl font-bold">Returned Books</h2>
            <p className="mt-1 text-sm text-slate-400">
              Books that have already been returned.
            </p>
          </div>

          {loading ? (
            <div className="p-10 text-center text-slate-400">
              Loading transactions...
            </div>
          ) : returnedTransactions.length === 0 ? (
            <div className="p-10 text-center text-slate-400">
              No returned books.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead className="bg-slate-950">
                  <tr className="text-left text-sm text-slate-400">
                    <th className="px-6 py-4">Book</th>
                    <th className="px-6 py-4">Member</th>
                    <th className="px-6 py-4">Issue Date</th>
                    <th className="px-6 py-4">Return Date</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {returnedTransactions.map((transaction) => (
                    <tr
                      key={transaction._id}
                      className="border-t border-slate-800"
                    >
                      <td className="px-6 py-4 font-semibold">
                        {transaction.book?.title || "Book unavailable"}
                      </td>

                      <td className="px-6 py-4 text-slate-300">
                        {transaction.member?.name || "Member unavailable"}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-400">
                        {formatDate(transaction.issueDate)}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-400">
                        {formatDate(transaction.returnDate)}
                      </td>

                      <td className="px-6 py-4">
                        <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-400">
                          Returned
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
