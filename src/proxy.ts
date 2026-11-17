import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  ADMIN_BASE_PATH,
  adminPath,
  isAdminBasePath,
  isLegacyAdminPath,
} from "@/lib/admin-path";

function rewriteToInternalAdmin(
  request: NextRequest,
  pathname: string,
  sourceResponse?: NextResponse
): NextResponse {
  if (ADMIN_BASE_PATH === "/admin") {
    const res = sourceResponse ?? NextResponse.next({ request });
    res.headers.set("Cache-Control", "no-store");
    return res;
  }

  const subPath = pathname.slice(ADMIN_BASE_PATH.length) || "/";
  const rewriteUrl = request.nextUrl.clone();
  rewriteUrl.pathname = subPath === "/" ? "/admin" : `/admin${subPath}`;

  const rewriteResponse = NextResponse.rewrite(rewriteUrl);
  if (sourceResponse) {
    sourceResponse.cookies.getAll().forEach((cookie) => {
      rewriteResponse.cookies.set(cookie);
    });
  }
  rewriteResponse.headers.set("Cache-Control", "no-store");
  return rewriteResponse;
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (isLegacyAdminPath(pathname)) {
    const notFoundUrl = request.nextUrl.clone();
    notFoundUrl.pathname = "/__nonexistent_404__";
    notFoundUrl.search = "";
    return NextResponse.rewrite(notFoundUrl, { status: 404 });
  }

  if (!isAdminBasePath(pathname)) {
    return NextResponse.next({ request });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!supabaseUrl || !supabaseAnonKey) {
    return rewriteToInternalAdmin(request, pathname);
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // Always validate the user on the server with getUser() rather than getSession()
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const subPath = pathname.slice(ADMIN_BASE_PATH.length) || "/";
  const isLoginRoute = subPath === "/login";

  if (!user) {
    if (!isLoginRoute) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = adminPath("/login");
      loginUrl.search = "";
      return NextResponse.redirect(loginUrl);
    }
    return rewriteToInternalAdmin(request, pathname, supabaseResponse);
  }

  const { data: isAdmin, error: rpcError } = await supabase.rpc("is_admin");
  const authorized = !rpcError && isAdmin === true;

  if (!authorized) {
    await supabase.auth.signOut();
    if (!isLoginRoute) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = adminPath("/login");
      loginUrl.search = "?error=unauthorized";
      const redirectResponse = NextResponse.redirect(loginUrl);
      supabaseResponse.cookies.getAll().forEach((cookie) => {
        redirectResponse.cookies.set(cookie);
      });
      redirectResponse.headers.set("Cache-Control", "no-store");
      return redirectResponse;
    }
    return rewriteToInternalAdmin(request, pathname, supabaseResponse);
  }

  if (isLoginRoute) {
    const adminUrl = request.nextUrl.clone();
    adminUrl.pathname = ADMIN_BASE_PATH;
    adminUrl.search = "";
    const redirectResponse = NextResponse.redirect(adminUrl);
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie);
    });
    redirectResponse.headers.set("Cache-Control", "no-store");
    return redirectResponse;
  }

  return rewriteToInternalAdmin(request, pathname, supabaseResponse);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.png|robots.txt|sitemap.xml).*)",
  ],
};
