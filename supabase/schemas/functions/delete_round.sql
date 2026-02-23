CREATE OR REPLACE FUNCTION public.delete_round (p_matchday_id INTEGER) RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  DELETE FROM public.matchdays WHERE id = p_matchday_id;
END;
$$;
