export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950">
      <div className="mx-auto max-w-7xl px-6 py-8 text-center">
        <h3 className="text-lg font-semibold text-white">
          Library Management System
        </h3>

        <p className="mt-2 text-sm text-slate-400">
          Manage books, members and library transactions.
        </p>

        <div className="my-5 h-px bg-slate-800" />

        <p className="text-sm text-slate-500">
          (c) 2026 Kanwal Afrin Sheikh. All rights reserved.
        </p>

        <p className="mt-1 text-xs text-slate-600">
          Built with Next.js, MongoDB and Tailwind CSS
        </p>
      </div>
    </footer>
  );
}
