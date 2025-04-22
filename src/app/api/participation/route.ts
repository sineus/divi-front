import { createServerClient } from "@/utils/supabase";

export async function GET(req: Request) {
  const supabase = await createServerClient();
  const address = req.headers.get("x-user-wallet");

  const { data: participations, error: participationError } = await supabase
    .from("request_participations")
    .select()
    .order("createdAt", { ascending: false })
    .eq("payer", address);

  if (participationError) {
    return Response.error();
  }

  for (const participation of participations) {
    const { data, error } = await supabase
      .from("requests")
      .select()
      .eq("address", participation.requestAddress);

    if (error) {
      continue;
    }

    if (data.length === 0) {
      continue;
    }

    participation.request = data[0];

    /* let res = await supabase
      .from("request_participations")
      .select()
      .eq("requestAddress", participation.requestAddress); */

    participation.request.participants = [];
  }

  return Response.json(participations);
}
