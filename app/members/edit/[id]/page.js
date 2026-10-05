"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";

function EditMemberContent({ params }) {
  const router = useRouter();

  const [memberId, setMemberId] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    membershipDate: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadMember = async () => {
      try {
        const { id } = await params;

        setMemberId(id);

        const response = await fetch(`/api/members/${id}`);
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to fetch member");
        }

        const member = data.member;

        setFormData({
          name: member.name || "",
          email: member.email || "",
          phone: member.phone || "",
          address: member.address || "",
          membershipDate: member.membershipDate
            ? new Date(member.membershipDate).toISOString().split("T")[0]
            : "",
        });
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadMember();
  }, [params]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(`/api/members/${memberId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to update member");
      }

      setMessage("Member updated successfully.");

      setTimeout(() => {
        router.push(`/members/${memberId}`);
      }, 800);
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-slate-400">Loading member...</p>
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
            Edit Member
          </h1>

          <p className="mt-2 text-slate-400">
            Update member information.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-6 rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-green-300">
            {message}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl md:p-8"
        >
          <div className="grid gap-6 md:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Full Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500"
                placeholder="Enter member name"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500"
                placeholder="Enter email"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Phone
              </label>

              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500"
                placeholder="Enter phone number"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Membership Date
              </label>

              <input
                type="date"
                name="membershipDate"
                value={formData.membershipDate}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Address
              </label>

              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                rows="4"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500"
                placeholder="Enter member address"
              />
            </div>

          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">

            <Link
              href={`/members/${memberId}`}
              className="rounded-xl border border-slate-700 px-6 py-3 text-center font-semibold text-slate-300 transition hover:bg-slate-800"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Updating..." : "Update Member"}
            </button>

          </div>
        </form>
      </div>
    </main>
  );
}

export default function EditMemberPage({ params }) {
  return (
    <ProtectedRoute>
      <EditMemberContent params={params} />
    </ProtectedRoute>
  );
}
