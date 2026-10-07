-- Rate limiting for the public ai-chatbot Edge Function.
-- Keys are SHA-256 hashes (of the visitor's IP, or 'global'), never raw IPs.
CREATE TABLE public.chatbot_rate_limits (
  key text NOT NULL,
  window_start timestamptz NOT NULL,
  hits integer NOT NULL DEFAULT 0,
  PRIMARY KEY (key, window_start)
);

-- No policies: only the service role (Edge Functions) can touch this table.
ALTER TABLE public.chatbot_rate_limits ENABLE ROW LEVEL SECURITY;

-- Records one hit for p_key in the current fixed window and returns whether it is within p_limit.
CREATE OR REPLACE FUNCTION public.chatbot_rate_limit_hit(p_key text, p_limit integer, p_window_seconds integer)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_window timestamptz := to_timestamp(floor(extract(epoch FROM now()) / p_window_seconds) * p_window_seconds);
  v_hits integer;
BEGIN
  INSERT INTO public.chatbot_rate_limits AS r (key, window_start, hits)
  VALUES (p_key, v_window, 1)
  ON CONFLICT (key, window_start) DO UPDATE SET hits = r.hits + 1
  RETURNING hits INTO v_hits;

  -- Opportunistic cleanup of expired windows
  IF random() < 0.01 THEN
    DELETE FROM public.chatbot_rate_limits WHERE window_start < now() - interval '2 days';
  END IF;

  RETURN v_hits <= p_limit;
END;
$$;

REVOKE ALL ON FUNCTION public.chatbot_rate_limit_hit(text, integer, integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.chatbot_rate_limit_hit(text, integer, integer) TO service_role;
