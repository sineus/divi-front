import { createServerClient } from "@/utils/supabase";
import { createDecoder } from "fast-jwt";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ address: string }> }
) {
  const { tx } = await req.json();
  const supabase = await createServerClient();
  const token = req.headers.get("authorization").split(" ")[1];
  const { address } = await params;

  const decode = createDecoder();
  const payload = decode(token);

  let { data, error } = await supabase
    .from("requests")
    .update({
      closeTx: tx,
    })
    .eq("address", address)
    .single();

  if (error) {
    console.log(error);
    return Response.error();
  }

  return Response.json(data);
}
