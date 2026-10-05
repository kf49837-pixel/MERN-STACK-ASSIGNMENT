"use client";

import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="hidden min-h-screen w-64 border-r border-slate-800 bg-slate-950 p-5 lg:block">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white">
          Library Management
        </h2>

        <p className="mt-1 text-xs text-slate-500">
          Admin Panel
        </p>
      </div>

      <nav className="space-y-2">
        <Link
          href="/dashboard"
          className="block rounded-lg px-4 py-3 text-slate-300 transition hover:bg-slate-800 hover:text-white"
        >
          Dashboard
        </Link>

        <Link
          href="/books"
          className="block rounded-lg px-4 py-3 text-slate-300 transition hover:bg-slate-800 hover:text-white"
        >
          Books
        </Link>

        <Link
          href="/members"
          className="block rounded-lg px-4 py-3 text-slate-300 transition hover:bg-slate-800 hover:text-white"
        >
          Members
        </Link>

        <Link
          href="/transactions"
          className="block rounded-lg px-4 py-3 text-slate-300 transition hover:bg-slate-800 hover:text-white"
        >
          Transactions
        </Link>

        <Link
          href="/transactions/issue"
          className="block rounded-lg px-4 py-3 text-slate-300 transition hover:bg-slate-800 hover:text-white"
        >
          Issue Book
        </Link>

        <Link
          href="/transactions/issued"
          className="block rounded-lg px-4 py-3 text-slate-300 transition hover:bg-slate-800 hover:text-white"
        >
          Issued / Returned
        </Link>
      </nav>
    </aside>
  );
}
