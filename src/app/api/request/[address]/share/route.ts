import { PaymentRequest } from "@/types";
import { createServerClient } from "@/utils/supabase";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ address: string }> }
) {
  const supabase = await createServerClient();
  const { address } = await params;
  const walletAddress = req.headers.get("x-user-wallet");

  const { data, error } = await supabase
    .from("request_participations")
    .insert([
      {
        amount: 0,
        requestAddress: address,
        payer: walletAddress,
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
