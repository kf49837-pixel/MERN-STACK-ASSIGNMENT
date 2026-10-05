"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";

function MemberDetailsContent({ params }) {
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const { id } = await params;

        const response = await fetch(`/api/members/${id}`);
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to fetch member");
        }

        setMember(data.member);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMember();
  }, [params]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-slate-400">Loading member details...</p>
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
            href="/members"
            className="mt-6 inline-block text-blue-400 hover:text-blue-300"
          >
            ? Back to Members
          </Link>
        </div>
      </main>
    );
  }

  if (!member) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-slate-400">Member not found.</p>

          <Link
            href="/members"
            className="mt-6 inline-block text-blue-400 hover:text-blue-300"
          >
            ? Back to Members
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-4xl">

        <div className="mb-8">
          <Link
            href="/members"
            className="text-sm text-blue-400 hover:text-blue-300"
          >
            ? Back to Members
          </Link>

          <p className="mt-6 text-sm uppercase tracking-[0.25em] text-blue-400">
            Library Management
          </p>

          <h1 className="mt-2 text-3xl font-bold md:text-4xl">
            Member Details
          </h1>

          <p className="mt-2 text-slate-400">
            View complete member information.
          </p>
        </div>

        <div className="mb-6 flex justify-end">
          <Link
            href={`/members/edit/${member._id}`}
            className="rounded-xl bg-blue-600 px-5 py-3 text-center font-semibold transition hover:bg-blue-500"
          >
            Edit Member
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl md:p-8">

          <div className="mb-8 border-b border-slate-800 pb-6">
            <p className="text-sm uppercase tracking-wider text-slate-500">
              Member Name
            </p>

            <h2 className="mt-2 text-3xl font-bold text-white">
              {member.name}
            </h2>

            <p className="mt-2 text-slate-400">
              {member.email}
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
              <p className="text-sm text-slate-500">Full Name</p>
              <p className="mt-2 font-semibold text-white">
                {member.name}
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
              <p className="text-sm text-slate-500">Email</p>
              <p className="mt-2 break-all font-semibold text-white">
                {member.email}
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
              <p className="text-sm text-slate-500">Phone</p>
              <p className="mt-2 font-semibold text-white">
                {member.phone}
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
              <p className="text-sm text-slate-500">Membership Date</p>
              <p className="mt-2 font-semibold text-white">
                {new Date(member.membershipDate).toLocaleDateString()}
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 sm:col-span-2">
              <p className="text-sm text-slate-500">Address</p>
              <p className="mt-2 font-semibold text-white">
                {member.address}
              </p>
            </div>

          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">

            <Link
              href="/members"
              className="rounded-xl border border-slate-700 px-6 py-3 text-center font-semibold text-slate-300 transition hover:bg-slate-800"
            >
              Back to Members
            </Link>

            <Link
              href={`/members/edit/${member._id}`}
              className="rounded-xl bg-blue-600 px-6 py-3 text-center font-semibold transition hover:bg-blue-500"
            >
              Edit This Member
            </Link>

          </div>

        </div>
      </div>
    </main>
  );
}

export default function MemberDetailsPage({ params }) {
  return (
    <ProtectedRoute>
      <MemberDetailsContent params={params} />
    </ProtectedRoute>
  );
}
