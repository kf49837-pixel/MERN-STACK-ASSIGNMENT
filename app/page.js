import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 text-center">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-amber-400">
          Library Management System
        </p>

        <h1 className="max-w-4xl text-4xl font-bold tracking-tight sm:text-6xl">
          Manage Your Library
          <span className="block text-amber-400">Smartly & Easily</span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
          Manage books, members, book issues, returns, and library
          transactions from one simple dashboard.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <a
            href="/dashboard"
            className="rounded-xl bg-amber-400 px-7 py-3 font-semibold text-slate-950 transition hover:bg-amber-300"
          >
            Go to Dashboard
          </a>

          <a
            href="/login"
            className="rounded-xl border border-slate-700 px-7 py-3 font-semibold text-white transition hover:bg-slate-800"
          >
            Login
          </a>
        </div>

        <div className="mt-16 grid w-full max-w-4xl gap-5 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold text-amber-400">Books</h2>
            <p className="mt-2 text-sm text-slate-400">
              Add, update, search, and manage library books.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold text-amber-400">Members</h2>
            <p className="mt-2 text-sm text-slate-400">
              Manage library members and their information.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold text-amber-400">
              Issue & Return
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Track issued books and handle returns easily.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
