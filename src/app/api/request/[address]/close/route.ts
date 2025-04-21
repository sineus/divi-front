import { createServerClient } from "@/utils/supabase";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ address: string }> }
) {
  const { tx } = await req.json();
  const supabase = await createServerClient();
  const { address } = await params;

  const { data, error } = await supabase
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
