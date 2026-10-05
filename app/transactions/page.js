"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const issuedCount = transactions.filter(
    (transaction) => transaction.status === "issued"
  ).length;

  const returnedCount = transactions.filter(
    (transaction) => transaction.status === "returned"
  ).length;

  return (
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
              Transaction History
            </h1>

            <p className="mt-2 text-slate-400">
              View all book issue and return transactions.
            </p>
          </div>

          <Link
            href="/transactions/issue"
            className="rounded-xl bg-blue-600 px-5 py-3 text-center font-semibold transition hover:bg-blue-500"
          >
            + Issue Book
          </Link>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">
            {error}
          </div>
        )}

        <div className="mb-8 grid gap-4 md:grid-cols-3">

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">
              Total Transactions
            </p>

            <p className="mt-2 text-3xl font-bold">
              {transactions.length}
            </p>
          </div>

          <div className="rounded-2xl border border-orange-500/20 bg-orange-500/5 p-6">
            <p className="text-sm text-slate-400">
              Currently Issued
            </p>

            <p className="mt-2 text-3xl font-bold text-orange-400">
              {issuedCount}
            </p>
          </div>

          <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-6">
            <p className="text-sm text-slate-400">
              Returned
            </p>

            <p className="mt-2 text-3xl font-bold text-green-400">
              {returnedCount}
            </p>
          </div>

        </div>

        <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">

          <div className="border-b border-slate-800 p-6">
            <h2 className="text-xl font-bold">
              All Transactions
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Complete transaction record from the library.
            </p>
          </div>

          {loading ? (
            <div className="p-10 text-center text-slate-400">
              Loading transactions...
            </div>
          ) : transactions.length === 0 ? (
            <div className="p-10 text-center text-slate-500">
              No transactions found.
            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full min-w-[900px]">

                <thead className="bg-slate-950">
                  <tr>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                      Book
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                      Member
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                      Issue Date
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                      Return Date
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                      Status
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {transactions.map((transaction) => (

                    <tr
                      key={transaction._id}
                      className="border-t border-slate-800"
                    >

                      <td className="px-6 py-5">
                        <p className="font-semibold text-white">
                          {transaction.book?.title || "Book deleted"}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          {transaction.book?.author || "-"}
                        </p>
                      </td>

                      <td className="px-6 py-5">
                        <p className="font-medium text-white">
                          {transaction.member?.name || "Member deleted"}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          {transaction.member?.email || "-"}
                        </p>
                      </td>

                      <td className="px-6 py-5 text-slate-300">
                        {formatDate(transaction.issueDate)}
                      </td>

                      <td className="px-6 py-5 text-slate-300">
                        {formatDate(transaction.returnDate)}
                      </td>

                      <td className="px-6 py-5">

                        {transaction.status === "issued" ? (
                          <span className="rounded-full bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-400">
                            Issued
                          </span>
                        ) : (
                          <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-400">
                            Returned
                          </span>
                        )}

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
