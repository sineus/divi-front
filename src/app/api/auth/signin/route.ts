import { User } from "@/types";
import { createServerClient, createToken } from "@/utils/supabase";
import { PublicKey } from "@solana/web3.js";
import base58 from "bs58";
import nacl from "tweetnacl";

export async function POST(req: Request) {
  const body = await req.json();
  const supabase = await createServerClient();

  const message = new TextEncoder().encode(
    "Please sign the message below to authenticate yourself"
  );
  const uint8arraySignature = base58.decode(body.signature);
  const publicKey = new PublicKey(body.address);

  const walletIsSigner = nacl.sign.detached.verify(
    message,
    uint8arraySignature,
    publicKey.toBuffer()
  );

  if (!walletIsSigner) {
    return Response.error();
  }

  let user: { address: string; id: string };

  let { data } = await supabase
    .from("users")
    .select("*")
    .eq("address", body.address)
    .single<User>();

  if (data) {
    user = data;
  } else {
    let { data, error } = await supabase
      .from("users")
      .insert([
        {
          address: body.address,
          // Add "Anonymous #X (X = increment of user count)"
          username: "Test",
        },
      ])
      .select()
      .single<User>();

    if (error) {
      return Response.error();
    }

    user = data;
  }

  return Response.json({
    user,
    accessToken: createToken(user),
  });
}
