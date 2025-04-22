import { PaymentRequest } from "@/types";
import { createServerClient } from "@/utils/supabase";

export async function POST(req: Request) {
  const body = await req.json();
  const supabase = await createServerClient();
  const address = req.headers.get("x-user-wallet");

  const { data, error } = await supabase
    .from("requests")
    .insert([
      {
        address: body.address,
        amount: body.amount,
        currency: body.currency,
        issuer: address,
        hasFinalized: false,
        paymentId: body.paymentId,
        tx: body.tx,
      },
    ])
    .select()
    .single<PaymentRequest>();

  if (error) {
    console.log(error);
    return Response.error();
  }

  return Response.json(data);
}

export async function GET(req: Request) {
  const supabase = await createServerClient();
  const address = req.headers.get("x-user-wallet");

  const { data: requests, error } = await supabase
    .from("requests")
    .select()
    .order("createdAt", { ascending: false })
    .eq("issuer", address);

  if (error) {
    return Response.error();
  }

  for (const request of requests) {
    const { data } = await supabase
      .from("request_participations")
      .select()
      .eq("requestAddress", request.address);

    const amount = data.reduce((prev, curr) => {
      prev += curr.amount;
      return prev;
    }, 0);

    request.participants = data;
    request.amountToPaid = request.amount - amount;
  }

  return Response.json(requests);
}
