import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const origin = req.nextUrl.origin;

  const redirectTo = (path: string) =>
    NextResponse.redirect(new URL(path, origin));
  if (pathname === "/") {
    return ;
  }

  if (!req.auth) {
    if (pathname !== "/login" && pathname !== "/register") {
      return redirectTo("/login");
    }
    return;
  }

  if (pathname === "/login" || pathname === "/register") {
    return redirectTo("/");
  }

  if (!req.auth.user.admin && pathname.startsWith("/admin")) {
    return redirectTo("/");
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
