import type { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2';

const sha256 = async (text: string) =>
  Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))))
    .map((b) => b.toString(16).padStart(2, '0')).join('');

export const clientIp = (req: Request) =>
  req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';

/**
 * Records a hit against a fixed-window limit (public.rate_limit_hit) and returns whether it is allowed.
 * Keys are hashed so no raw IP addresses or emails are stored.
 */
export async function allowHit(
  supabase: SupabaseClient,
  key: string,
  limit: number,
  windowSeconds: number,
): Promise<boolean> {
  const { data, error } = await supabase.rpc('rate_limit_hit', {
    p_key: key === 'global' ? key : await sha256(key),
    p_limit: limit,
    p_window_seconds: windowSeconds,
  });
  if (error) throw error;
  return data === true;
}
