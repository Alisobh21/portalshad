import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const nextIntlMiddleware = createMiddleware(routing);

export function middleware(req: NextRequest) {
  const res = nextIntlMiddleware(req);
  const url = req.nextUrl;
  const origin = url.origin;
  const searchParams = url.searchParams;
  const pathname = url.pathname;

  const authCookie = req.cookies.get("auth")?.value;
  const auth = authCookie && JSON.parse(authCookie);

  const secretParam = searchParams.get("secret");
  const MAINTENANCE_MODE = process.env.NEXT_PUBLIC_MAINTAINANCE_MODE;
  const MAINTENANCE_SECRET =
    process.env.NEXT_PUBLIC_MAINTAINANCE_MODE_SECRET || "secret";

  const localeMatch = pathname.match(/^\/(ar|en)(\/.*)?$/);
  const locale = localeMatch ? localeMatch[1] : "ar";
  const cleanPath = localeMatch?.[2] || "";

  const isInMaintenance = MAINTENANCE_MODE === "on";
  const isMaintenancePage = cleanPath.startsWith("/maintenance");
  const isSecretValid = secretParam === MAINTENANCE_SECRET;
  const secretQuery = isSecretValid ? `?secret=${MAINTENANCE_SECRET}` : "";

  const InactivePage = cleanPath.startsWith("/inactive");
  if (auth && auth.active === false && !InactivePage) {
    return NextResponse.redirect(`${origin}/${locale}/inactive`);
  }

  if (!isInMaintenance && isMaintenancePage) {
    return NextResponse.redirect(`${origin}/${locale}/`);
  }

  if (isMaintenancePage && isSecretValid) {
    const referer = req.headers.get("referer") || "";
    const cameFromLoginOrRegister =
      referer.includes("/login") || referer.includes("/register");
    if (!cameFromLoginOrRegister) {
      return NextResponse.redirect(`${origin}/${locale}/${secretQuery}`);
    }
  }

  if (isInMaintenance && !isSecretValid && !isMaintenancePage) {
    return NextResponse.redirect(`${origin}/${locale}/maintenance`);
  }

  const isLoginOrRegisterPage = ["/login", "/register", "/reset"].some(
    (route) => cleanPath.startsWith(route) || pathname.startsWith(route)
  );

  const isPublicRoute = cleanPath.startsWith("/sawb-tracking");
  const isProtectedRoute = !isLoginOrRegisterPage && !isPublicRoute;

  if (!auth && isProtectedRoute && (!isInMaintenance || isSecretValid)) {
    return NextResponse.redirect(`${origin}/${locale}/login${secretQuery}`);
  }

  if (auth && isLoginOrRegisterPage) {
    return NextResponse.redirect(`${origin}/${locale}/${secretQuery}`);
  }

  const isUsersPage =
    cleanPath.startsWith("/users") ||
    cleanPath.startsWith("/cod-reports") ||
    cleanPath.startsWith("/pending-orders");
  if (!isInMaintenance || isSecretValid) {
    if (
      auth?.roles?.some((role: { name?: string }) => role?.name === "admin")
    ) {
      if (!isUsersPage && cleanPath !== "/unauthorized") {
        return NextResponse.redirect(`${origin}/${locale}/users${secretQuery}`);
      }
    } else if (!auth?.maskLogin && isUsersPage) {
      return NextResponse.redirect(`${origin}/${locale}/${secretQuery}`);
    }
  }

  return res;
}

export const config = {
  matcher: ["/", "/login", "/register", "/(ar|en)/:path*"],
};
