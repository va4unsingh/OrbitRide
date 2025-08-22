import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const userType = req.auth?.user?.userType;

  if (nextUrl.pathname.startsWith("/captain")) {
    if (!isLoggedIn) {
      return Response.redirect(new URL("/sign-in", nextUrl));
    }
    if (userType !== "captain") {
      return Response.redirect(new URL("/dashboard", nextUrl));
    }
    return NextResponse.next();
  }

  if (nextUrl.pathname.startsWith("/user")) {
    if (!isLoggedIn) {
      return Response.redirect(new URL("/sign-in", nextUrl));
    }
    if (userType !== "user") {
      return Response.redirect(new URL("/dashboard", nextUrl));
    }
    return NextResponse.next();
  }

  if (isLoggedIn && nextUrl.pathname === "/sign-in") {
    return Response.redirect(new URL("/dashboard", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
