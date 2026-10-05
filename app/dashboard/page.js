"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Loading from "@/components/Loading";
import Footer from "@/components/Footer";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState({
    totalBooks: 0,
    totalMembers: 0,
    issuedBooks: 0,
    returnedBooks: 0,
    availableBooks: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const response = await fetch("/api/dashboard");
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to load dashboard");
        }

        setDashboard(data.dashboard);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  const cards = [
    { title: "Total Books", value: dashboard.totalBooks, icon: "BOOKS" },
    { title: "Total Members", value: dashboard.totalMembers, icon: "MEMBERS" },
    { title: "Issued Books", value: dashboard.issuedBooks, icon: "ISSUED" },
    {
      title: "Returned Books",
      value: dashboard.returnedBooks,
      icon: "RETURNED",
    },
    {
      title: "Available Books",
      value: dashboard.availableBooks,
      icon: "AVAILABLE",
    },
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-950 text-white">
        <div className="flex min-h-screen">
          <Sidebar />

          <div className="flex min-w-0 flex-1 flex-col">
            <Navbar />

            <main className="flex-1 px-6 py-8 md:px-10">
              <div className="mx-auto max-w-7xl">
                <div className="mb-10">
                  <p className="mb-2 text-sm font-medium uppercase tracking-[0.25em] text-blue-400">
                    Library Management
                  </p>

                  <h1 className="text-3xl font-bold md:text-4xl">
                    Dashboard
                  </h1>

                  <p className="mt-2 text-slate-400">
                    Manage books, members and library transactions.
                  </p>
                </div>

                {error && (
                  <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">
                    {error}
                  </div>
                )}

                {loading ? (
                  <Loading />
                ) : (
                  <>
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
                      {cards.map((card) => (
                        <div
                          key={card.title}
                          className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl transition hover:-translate-y-1 hover:border-blue-500/50"
                        >
                          <div className="mb-5 flex items-center justify-between">
                            <span className="text-xs font-bold tracking-wider text-blue-400">
                              {card.icon}
                            </span>

                            <div className="h-2 w-2 rounded-full bg-blue-400" />
                          </div>

                          <p className="text-sm text-slate-400">
                            {card.title}
                          </p>

                          <h2 className="mt-2 text-3xl font-bold">
                            {card.value}
                          </h2>
                        </div>
                      ))}
                    </div>

                    <section className="mt-10">
                      <h2 className="mb-5 text-2xl font-bold">
                        Quick Actions
                      </h2>

                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <Link
                          href="/books"
                          className="rounded-xl border border-slate-800 bg-slate-900 p-5 transition hover:border-blue-500 hover:bg-slate-800"
                        >
                          <h3 className="font-semibold">Manage Books</h3>
                          <p className="mt-1 text-sm text-slate-400">
                            Add, edit and manage books
                          </p>
                        </Link>

                        <Link
                          href="/members"
                          className="rounded-xl border border-slate-800 bg-slate-900 p-5 transition hover:border-blue-500 hover:bg-slate-800"
                        >
                          <h3 className="font-semibold">Manage Members</h3>
                          <p className="mt-1 text-sm text-slate-400">
                            Manage library members
                          </p>
                        </Link>

                        <Link
                          href="/transactions/issue"
                          className="rounded-xl border border-slate-800 bg-slate-900 p-5 transition hover:border-blue-500 hover:bg-slate-800"
                        >
                          <h3 className="font-semibold">Issue Book</h3>
                          <p className="mt-1 text-sm text-slate-400">
                            Issue a book to a member
                          </p>
                        </Link>

                        <Link
                          href="/transactions"
                          className="rounded-xl border border-slate-800 bg-slate-900 p-5 transition hover:border-blue-500 hover:bg-slate-800"
                        >
                          <h3 className="font-semibold">Transactions</h3>
                          <p className="mt-1 text-sm text-slate-400">
                            View issue and return history
                          </p>
                        </Link>
                      </div>
                    </section>
                  </>
                )}
              </div>
            </main>

            <Footer />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
