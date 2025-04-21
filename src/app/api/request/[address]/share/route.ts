import { PaymentRequest } from "@/types";
import { createServerClient } from "@/utils/supabase";
import { createDecoder } from "fast-jwt";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ address: string }> }
) {
  const supabase = await createServerClient();
  const token = req.headers.get("authorization").split(" ")[1];
  const { address } = await params;

  const decode = createDecoder();
  const payload = decode(token);

  const { data, error } = await supabase
    .from("request_participations")
    .insert([
      {
        amount: 10,
        requestAddress: address,
        payer: payload.address,
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
