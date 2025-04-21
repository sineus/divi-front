import { createBrowserClient as nativeCreateBrowserClient } from "@supabase/ssr";

export const createBrowserClient = () =>
  nativeCreateBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
