CREATE OR REPLACE FUNCTION public.get_round (p_matchday_id INT) RETURNS TABLE (
  round_number INT,
  round_type TEXT,
  round_date DATE,
  is_hit BOOLEAN,
  season TEXT,
  related_matchday_id INT,
  picks JSONB,
  votes JSONB
) LANGUAGE sql SECURITY DEFINER AS $$
SELECT
  m.round_number,
  rt.name AS round_type,
  m.match_date AS round_date,
  m.correct AS is_hit,
  s.name AS season,
  m.related_matchday_id AS related_matchday_id,
  (
  SELECT COALESCE(
    JSONB_AGG(
      JSONB_BUILD_OBJECT(
        'player', JSONB_BUILD_OBJECT(
          'id', pl.id,
          'username', pl.username
        ),
        'league', JSONB_BUILD_OBJECT(
          'id', l.id,
          'name', l.name,
          'country', l.country
        ),
        'odd', p.odds,
        'is_chosen', p.is_chosen,
        'is_hit', p.is_hit
      )
      ORDER BY pl.username
    ),
    '[]'::JSONB
  )
  FROM public.picks p
  JOIN public.players pl ON pl.id = p.player_id
  JOIN public.leagues l ON l.id = p.league_id
  WHERE p.matchday_id = m.id
) AS picks,
  (
  SELECT COALESCE(
    JSONB_AGG(
      JSONB_BUILD_OBJECT(
        'voter', JSONB_BUILD_OBJECT(
          'id', pl.id,
          'username', pl.username
        ),
        'votes_for', COALESCE(vf.players, '[]'::JSONB)
      )
      ORDER BY pl.username
    ),
    '[]'::JSONB
  )
  FROM public.players pl
  LEFT JOIN (
    SELECT
      v.player_id AS voter_id,
      JSONB_AGG(
        JSONB_BUILD_OBJECT(
          'id', p2.id,
          'username', p2.username
        )
        ORDER BY p2.username
      ) AS players
    FROM public.votes v
    JOIN public.picks pk ON pk.id = v.pick_id
    JOIN public.players p2 ON p2.id = pk.player_id
    WHERE pk.matchday_id = m.id
    GROUP BY v.player_id
  ) vf ON vf.voter_id = pl.id
) AS votes
FROM public.matchdays m
JOIN public.round_types rt ON rt.id = m.round_type_id
JOIN public.seasons s ON s.id = m.season_id
WHERE m.id = p_matchday_id;
$$;
