import { createServerClient } from "@/utils/supabase";
import { createDecoder } from "fast-jwt";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ address: string }> }
) {
  const body = await req.json();
  const supabase = await createServerClient();
  const token = req.headers.get("authorization").split(" ")[1];
  const { address } = await params;

  const decode = createDecoder();
  const payload = decode(token);

  let { data, error } = await supabase
    .from("request_participations")
    .update({ hasPaid: true, amount: body.amount })
    .eq("requestAddress", address)
    .eq("payer", payload.address)
    .select()
    .single();

  if (error) {
    console.log(error);
    return Response.error();
  }

  let { data: participations } = await supabase
    .from("request_participations")
    .select()
    .eq("requestAddress", address);

  const amount = participations.reduce((prev, curr) => {
    prev += curr.amount;
    return prev;
  }, 0);

  let { data: request } = await supabase
    .from("requests")
    .select()
    .eq("address", address)
    .single();

  await supabase
    .from("requests")
    .update({
      hasFinalized: request.amount === amount,
    })
    .eq("address", address)
    .single();

  return Response.json(data);
}
