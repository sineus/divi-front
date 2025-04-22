import { createServerClient } from "@/utils/supabase";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ address: string }> }
) {
  const body = await req.json();
  const supabase = await createServerClient();
  const { address } = await params;
  const walletAddress = req.headers.get("x-user-wallet");

  const { data, error } = await supabase
    .from("request_participations")
    .update({ hasPaid: true, amount: body.amount })
    .eq("requestAddress", address)
    .eq("payer", walletAddress)
    .select()
    .single();

  if (error) {
    console.log(error);
    return Response.error();
  }

  const { data: participations } = await supabase
    .from("request_participations")
    .select()
    .eq("requestAddress", address);

  const amount = participations.reduce((prev, curr) => {
    prev += curr.amount;
    return prev;
  }, 0);

  const { data: request } = await supabase
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
