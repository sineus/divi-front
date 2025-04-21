import { User } from "@/types";
import { createSigner } from "fast-jwt";

const signer = createSigner({
  key: "super-secret-jwt-token-with-at-least-32-characters-long",
  algorithm: "HS256",
});

export function createToken(user: User) {
  const ONE_HOUR = 60 * 60;
  const exp = Math.round(Date.now() / 1000) + ONE_HOUR;
  const payload = {
    exp,
    sub: user.id,
    address: user.address,
    role: "authenticated",
  };

  return signer(payload);
}
