"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  }

  return (
    <nav className="border-b border-slate-800 bg-slate-950">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          href="/dashboard"
          className="text-xl font-bold text-white"
        >
          Library Management
        </Link>

        <div className="flex items-center gap-5 text-sm">
          <Link
            href="/dashboard"
            className="text-slate-300 transition hover:text-white"
          >
            Dashboard
          </Link>

          <Link
            href="/books"
            className="text-slate-300 transition hover:text-white"
          >
            Books
          </Link>

          <Link
            href="/members"
            className="text-slate-300 transition hover:text-white"
          >
            Members
          </Link>

          <Link
            href="/transactions"
            className="text-slate-300 transition hover:text-white"
          >
            Transactions
          </Link>

          <button
            onClick={handleLogout}
            className="rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition hover:bg-red-500"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
