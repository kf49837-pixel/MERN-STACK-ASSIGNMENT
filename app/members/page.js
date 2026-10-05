"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function MembersPage() {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchMembers() {
      try {
        setLoading(true);
        setError("");

        const params = new URLSearchParams();

        if (search.trim()) {
          params.append("search", search.trim());
        }

        const query = params.toString();

        const response = await fetch(
          query ? `/api/members?${query}` : "/api/members"
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to fetch members");
        }

        setMembers(data.members || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchMembers();
  }, [search]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this member?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      const response = await fetch(`/api/members/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to delete member");
      }

      setMembers((currentMembers) =>
        currentMembers.filter((member) => member._id !== id)
      );
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <ProtectedRoute>
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
                Members
              </h1>

              <p className="mt-2 text-slate-400">
                Manage all library members.
              </p>
            </div>

            <Link
              href="/members/add"
              className="rounded-xl bg-blue-600 px-5 py-3 text-center font-semibold transition hover:bg-blue-500"
            >
              + Add New Member
            </Link>
          </div>

          <div className="mb-6">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500"
            />
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">
              {error}
            </div>
          )}

          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">

            <div className="border-b border-slate-800 p-6">
              <h2 className="text-xl font-bold">
                All Members
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Total members: {members.length}
              </p>
            </div>

            {loading ? (
              <div className="p-10 text-center text-slate-400">
                Loading members...
              </div>
            ) : members.length === 0 ? (
              <div className="p-10 text-center text-slate-500">
                No members found.
              </div>
            ) : (
              <div className="overflow-x-auto">

                <table className="w-full min-w-[900px]">

                  <thead className="bg-slate-950">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                        Name
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                        Email
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                        Phone
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                        Address
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                        Membership Date
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {members.map((member) => (
                      <tr
                        key={member._id}
                        className="border-t border-slate-800"
                      >
                        <td className="px-6 py-5 font-semibold text-white">
                          {member.name}
                        </td>

                        <td className="px-6 py-5 text-slate-300">
                          {member.email}
                        </td>

                        <td className="px-6 py-5 text-slate-300">
                          {member.phone}
                        </td>

                        <td className="px-6 py-5 text-slate-300">
                          {member.address}
                        </td>

                        <td className="px-6 py-5 text-slate-400">
                          {new Date(
                            member.membershipDate
                          ).toLocaleDateString()}
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex flex-wrap gap-2">

                            <Link
                              href={`/members/${member._id}`}
                              className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 transition hover:border-blue-500 hover:text-white"
                            >
                              View
                            </Link>

                            <Link
                              href={`/members/edit/${member._id}`}
                              className="rounded-lg bg-blue-600 px-3 py-2 text-sm transition hover:bg-blue-500"
                            >
                              Edit
                            </Link>

                            <button
                              onClick={() => handleDelete(member._id)}
                              className="rounded-lg bg-red-600 px-3 py-2 text-sm transition hover:bg-red-500"
                            >
                              Delete
                            </button>

                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>

                </table>

              </div>
            )}

          </div>

        </div>
      </main>
    </ProtectedRoute>
  );
}
