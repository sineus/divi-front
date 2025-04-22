import * as jose from "jose";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { secretKey } from "./utils/supabase";

// This function can be marked `async` if using `await` inside
export async function middleware(req: NextRequest) {
  const token = req.headers.get("Authorization").split(" ")[1];

  try {
    const { payload } = await jose.jwtVerify(token, secretKey);
    const headers = new Headers(req.headers);

    headers.set("x-user-wallet", payload.address as string);

    return NextResponse.next({
      request: {
        headers,
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Auth required" }, { status: 401 });
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/api/request/:address*", "/api/request", "/api/participation"],
};
