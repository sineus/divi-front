import { User } from "@/types";
import * as jose from "jose";

export const secretKey = new TextEncoder().encode(
  process.env.NEXT_PUBLIC_SECRET
);

export async function createToken(user: User) {
  const jwt = await new jose.SignJWT({
    sub: user.id,
    address: user.address,
    role: "authenticated",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("1h")
    .sign(secretKey);

  return jwt;
}
