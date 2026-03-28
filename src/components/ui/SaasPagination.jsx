import React from "react";

export default function SaasPagination({
  page,
  totalPages,
  onPrev,
  onNext,
  leftText,
}) {
  const safeTotal = Math.max(1, Number(totalPages) || 1);
  const safePage = Math.min(Math.max(1, Number(page) || 1), safeTotal);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-sm text-slate-600">{leftText}</div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={safePage <= 1}
          onClick={onPrev}
        >
          Previous
        </button>
        <span className="rounded-xl bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">
          Page <span className="font-semibold">{safePage}</span> of{" "}
          <span className="font-semibold">{safeTotal}</span>
        </span>
        <button
          type="button"
          className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={safePage >= safeTotal}
          onClick={onNext}
        >
          Next
        </button>
      </div>
    </div>
  );
}

