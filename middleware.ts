import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {

	const cookies = getSessionCookie(request);

	if (!cookies) {
		return NextResponse.redirect(new URL("/auth/login", request.url));
	}
	return NextResponse.next();
}

export const config = {
	matcher: [
        {
			source: '/((?!auth/|about$|api/|_next/static|favicon\\.ico|manifest\\.webmanifest|\.well-known).*)',
			missing: [
				{ type: "header", key: "next-action" },
			],
		}
    ],
};