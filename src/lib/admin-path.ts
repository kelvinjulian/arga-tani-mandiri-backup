const DEFAULT_ADMIN_SLUG = "atm-kelola";
const ADMIN_SLUG_REGEX = /^[a-z0-9-]{3,40}$/;

function resolveAdminSlug(): string {
  const raw = process.env.NEXT_PUBLIC_ADMIN_PATH?.trim();
  if (!raw) {
    return DEFAULT_ADMIN_SLUG;
  }

  const normalized = raw.replace(/^\/+|\/+$/g, "");
  if (!ADMIN_SLUG_REGEX.test(normalized)) {
    return DEFAULT_ADMIN_SLUG;
  }

  return normalized;
}

export const ADMIN_SLUG = resolveAdminSlug();
export const ADMIN_BASE_PATH = `/${ADMIN_SLUG}`;

export function adminPath(subPath = ""): string {
  if (!subPath || subPath === "/") {
    return ADMIN_BASE_PATH;
  }
  const clean = subPath.startsWith("/") ? subPath : `/${subPath}`;
  return `${ADMIN_BASE_PATH}${clean}`;
}

export function isAdminBasePath(pathname: string): boolean {
  return (
    pathname === ADMIN_BASE_PATH || pathname.startsWith(`${ADMIN_BASE_PATH}/`)
  );
}

export function isLegacyAdminPath(pathname: string): boolean {
  if (ADMIN_BASE_PATH === "/admin") {
    return false;
  }
  return pathname === "/admin" || pathname.startsWith("/admin/");
}
