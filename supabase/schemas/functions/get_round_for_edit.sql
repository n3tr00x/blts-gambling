CREATE OR REPLACE FUNCTION public.get_round_for_edit (p_matchday_id INTEGER) RETURNS TABLE (
  round_type_id INTEGER,
  round_date DATE,
  round_number INTEGER,
  is_hit BOOLEAN,
  related_matchday_id INTEGER,
  picks JSONB,
  votes JSONB
) LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN QUERY
    SELECT
      m.round_type_id,
      m.match_date,
      m.round_number,
      m.correct,
      m.related_matchday_id,
      (
        SELECT COALESCE(
          JSONB_AGG(
            JSONB_BUILD_OBJECT(
              'player_id', p.player_id,
              'league_id', p.league_id,
              'odd', p.odds,
              'is_chosen', p.is_chosen,
              'is_hit', p.is_hit
            )
            ORDER BY p.player_id
          ),
          '[]'::JSONB
        )
        FROM public.picks p
        WHERE p.matchday_id = m.id
      ) AS picks,
      (
        SELECT COALESCE(
          JSONB_AGG(
            JSONB_BUILD_OBJECT(
              'voter_id', v.player_id,
              'votes_for', v.votes_for
            )
            ORDER BY v.player_id
          ),
          '[]'::JSONB
        )
        FROM (
          SELECT
            vt.player_id,
            JSONB_AGG(pk.player_id ORDER BY pk.player_id) AS votes_for
          FROM public.votes vt
          JOIN public.picks pk ON pk.id = vt.pick_id
          WHERE pk.matchday_id = m.id
          GROUP BY vt.player_id
        ) v
      ) AS votes
    FROM public.matchdays m
    WHERE m.id = p_matchday_id;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Matchday % nie istnieje', p_matchday_id;
    END IF;
END;
$$;
