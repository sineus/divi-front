import { createServerClient } from "@/utils/supabase";
import { createDecoder } from "fast-jwt";

export async function GET(req: Request) {
  const supabase = await createServerClient();
  const token = req.headers.get("authorization").split(" ")[1];

  const decode = createDecoder();
  const payload = decode(token);

  const { data: participations, error: participationError } = await supabase
    .from("request_participations")
    .select()
    .order("createdAt", { ascending: false })
    .eq("payer", payload.address);

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
