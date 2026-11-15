import { ArrowLeft, ChevronRight } from "lucide-react";
import { AdminSafeLink } from "./AdminSafeLink";

export interface AdminBreadcrumbCrumb {
  label: string;
  href?: string;
}

interface AdminBreadcrumbProps {
  crumbs: AdminBreadcrumbCrumb[];
  backHref?: string;
  backLabel?: string;
  className?: string;
}

export function AdminBreadcrumb({
  crumbs,
  backHref,
  backLabel,
  className = "mb-5",
}: AdminBreadcrumbProps) {
  const currentCrumb = crumbs[crumbs.length - 1];
  const fallbackParent = [...crumbs.slice(0, -1)]
    .reverse()
    .find((crumb) => Boolean(crumb.href));

  const resolvedBackHref = backHref ?? fallbackParent?.href ?? "/admin";
  const resolvedBackLabel =
    backLabel ?? fallbackParent?.label ?? "Dashboard";

  return (
    <div className={`flex flex-col gap-2.5 ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <AdminSafeLink
          href={resolvedBackHref}
          className="inline-flex min-h-[40px] items-center gap-2 rounded-xl border border-[#CBD8D0] bg-white px-3.5 py-2 text-xs font-semibold text-[#143D29] shadow-xs transition-colors hover:bg-[#EAF3EE] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F1F17]"
        >
          <ArrowLeft className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span>Kembali ke {resolvedBackLabel}</span>
        </AdminSafeLink>
      </div>

      <nav aria-label="Breadcrumb" className="min-w-0">
        {/* Narrow screen (<640px): show current page title cleanly without horizontal overflow */}
        {currentCrumb && (
          <p className="truncate text-xs font-semibold text-[#0F1F17] sm:hidden">
            <span aria-current="page">{currentCrumb.label}</span>
          </p>
        )}

        {/* Desktop / tablet (>=640px): full breadcrumb trail */}
        <ol className="hidden flex-wrap items-center gap-1.5 text-xs text-[#43594D] sm:flex">
          {crumbs.map((crumb, index) => {
            const isLast = index === crumbs.length - 1;
            return (
              <li
                key={`${crumb.label}-${index}`}
                className="flex min-w-0 items-center gap-1.5"
              >
                {index > 0 && (
                  <ChevronRight
                    className="h-3.5 w-3.5 shrink-0 text-[#86A092]"
                    aria-hidden="true"
                  />
                )}
                {isLast ? (
                  <span
                    aria-current="page"
                    className="truncate font-semibold text-[#0F1F17]"
                  >
                    {crumb.label}
                  </span>
                ) : crumb.href ? (
                  <AdminSafeLink
                    href={crumb.href}
                    className="truncate font-medium text-[#2F5341] underline-offset-2 hover:text-[#143D29] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F1F17]"
                  >
                    {crumb.label}
                  </AdminSafeLink>
                ) : (
                  <span className="truncate text-[#587063]">
                    {crumb.label}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}
