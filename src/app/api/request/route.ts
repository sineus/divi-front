import { PaymentRequest } from "@/types";
import { createServerClient } from "@/utils/supabase";
import { createDecoder } from "fast-jwt";

export async function POST(req: Request) {
  const body = await req.json();
  const supabase = await createServerClient();
  const token = req.headers.get("authorization").split(" ")[1];

  const decode = createDecoder();
  const payload = decode(token);

  let { data, error } = await supabase
    .from("requests")
    .insert([
      {
        address: body.address,
        amount: body.amount,
        currency: body.currency,
        issuer: payload.address,
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
  const token = req.headers.get("authorization").split(" ")[1];

  const decode = createDecoder();
  const payload = decode(token);

  console.log(payload);

  let { data: requests, error } = await supabase
    .from("requests")
    .select()
    .order("createdAt", { ascending: false })
    .eq("issuer", payload.address);

  if (error) {
    return Response.error();
  }

  for (const request of requests) {
    let { data } = await supabase
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
