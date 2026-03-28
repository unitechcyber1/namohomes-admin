import React from "react";

export default function SaasTableShell({
  title,
  subtitle,
  actions,
  toolbar,
  children,
  footer,
}) {
  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-900">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
          ) : null}
        </div>
        {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
      </div>

      {toolbar ? (
        <div className="rounded-2xl border border-slate-200/70 bg-white p-3 shadow-[0_1px_0_rgba(15,23,42,0.04),0_8px_24px_rgba(15,23,42,0.06)]">
          {toolbar}
        </div>
      ) : null}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* overscroll-x-contain: avoid nested scroll + odd stretch when both axes feel “elastic” */}
        <div className="overflow-x-auto overscroll-x-contain">{children}</div>
        {footer ? (
          <div className="border-t border-slate-200 px-4 py-4">{footer}</div>
        ) : null}
      </div>
    </section>
  );
}

