export default function Loading() {
  return (
    <div className="flex min-h-[200px] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-slate-700 border-t-blue-500"></div>

        <p className="text-sm text-slate-400">
          Loading...
        </p>
      </div>
    </div>
  );
}
