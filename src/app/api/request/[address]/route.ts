import { createServerClient } from "@/utils/supabase";
import { createDecoder } from "fast-jwt";
import { NextRequest } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  const supabase = await createServerClient();
  const token = req.headers.get("authorization").split(" ")[1];
  const { address } = await params;

  const decode = createDecoder();
  const payload = decode(token);

  console.log(payload);

  let { error } = await supabase
    .from("requests")
    .delete()
    .eq("address", address);

  if (error) {
    return Response.error();
  }

  return Response.json(true);
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ address: string }> }
) {
  const supabase = await createServerClient();
  const token = req.headers.get("authorization").split(" ")[1];
  const { address } = await params;

  const decode = createDecoder();
  const payload = decode(token);

  let { data: request, error } = await supabase
    .from("requests")
    .select()
    .eq("address", address)
    .single();

  if (error) {
    return Response.error();
  }

  return Response.json(request);
}
