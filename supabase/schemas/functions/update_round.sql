CREATE OR REPLACE FUNCTION public.update_round (
  p_matchday_id INTEGER,
  p_round_type_id INTEGER,
  p_round_date DATE,
  p_is_hit BOOLEAN,
  p_picks JSONB,
  p_votes JSONB,
  p_related_matchday_id INTEGER DEFAULT NULL
) RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  detected_season_id INTEGER;
  pick_record JSONB;
  vote_record JSONB;
  created_pick_id INTEGER;
  pick_map JSONB := '{}'::JSONB;

BEGIN
  SELECT season_id
  INTO detected_season_id
  FROM public.matchdays
  WHERE id = p_matchday_id;

  IF detected_season_id IS NULL THEN
    RAISE EXCEPTION 'Matchday % nie istnieje', p_matchday_id;
  END IF;

  UPDATE public.matchdays
  SET
    round_type_id = p_round_type_id,
    match_date = p_round_date,
    correct = p_is_hit,
    related_matchday_id = p_related_matchday_id
  WHERE id = p_matchday_id;

  DELETE FROM public.votes v
  USING public.picks p
  WHERE p.id = v.pick_id
    AND p.matchday_id = p_matchday_id;

  FOR pick_record IN
    SELECT * FROM jsonb_array_elements(p_picks)
  LOOP
    INSERT INTO public.picks (
      player_id,
      season_id,
      matchday_id,
      league_id,
      odds,
      is_hit,
      is_chosen
    )
    VALUES (
      (pick_record->>'playerId')::INT,
      detected_season_id,
      p_matchday_id,
      (pick_record->>'leagueId')::INT,
      (pick_record->>'odd')::NUMERIC,
      (pick_record->>'isHit')::BOOL,
      (pick_record->>'isChosen')::BOOL
    )
    ON CONFLICT (player_id, matchday_id)
    DO UPDATE SET
      league_id = excluded.league_id,
      odds = excluded.odds,
      is_hit = excluded.is_hit,
      is_chosen = excluded.is_chosen
    RETURNING id INTO created_pick_id;

    pick_map := pick_map || jsonb_build_object(
      pick_record->>'playerId',
      created_pick_id
    );
  END LOOP;

  DELETE FROM public.picks
  WHERE matchday_id = p_matchday_id
    AND player_id NOT IN (
      SELECT (p->>'playerId')::INT
      FROM jsonb_array_elements(p_picks) p
    );

  FOR vote_record IN
    SELECT * FROM jsonb_array_elements(p_votes)
  LOOP
    DECLARE
      voter_id INT := (vote_record->>'voterId')::INT;
      voted_player_id_text TEXT;
      voted_pick_id INT;
    BEGIN
      FOR voted_player_id_text IN
        SELECT jsonb_array_elements_text(vote_record->'votesFor')
      LOOP
        voted_pick_id := (pick_map ->> voted_player_id_text)::INT;

        IF voted_pick_id IS NOT NULL THEN
          INSERT INTO public.votes (player_id, pick_id)
          VALUES (voter_id, voted_pick_id);
        END IF;
      END LOOP;
    END;
  END LOOP;

END;
$$;
