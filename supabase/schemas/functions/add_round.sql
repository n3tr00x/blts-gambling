CREATE OR REPLACE FUNCTION public.add_round (
  p_round_type_id INTEGER,
  p_round_date DATE,
  p_is_hit BOOLEAN,
  p_picks JSONB,
  p_votes JSONB,
  p_coupon_url TEXT DEFAULT NULL,
  p_related_matchday_id INTEGER DEFAULT NULL
) RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    new_matchday_id INTEGER;
    detected_season_id INTEGER;
    next_round_number INTEGER;
    
    pick_record JSONB;
    vote_record JSONB;
    created_pick_id INTEGER;
    pick_map JSONB := '{}'::JSONB;

BEGIN
    SELECT s.id
    INTO detected_season_id
    FROM public.seasons s
    WHERE s.start_date <= p_round_date
      AND s.end_date >= p_round_date
    LIMIT 1;

    IF detected_season_id IS NULL THEN
        RAISE EXCEPTION 'Brak sezonu obejmującego datę %', p_round_date;
    END IF;

    SELECT COALESCE(MAX(m.round_number), 0) + 1
    INTO next_round_number
    FROM public.matchdays m
    WHERE m.season_id = detected_season_id;

    INSERT INTO public.matchdays (
        season_id,
        related_matchday_id,
        round_type_id,
        round_number,
        match_date,
        correct,
        coupon_url
    )
    VALUES (
        detected_season_id,
        add_round.p_related_matchday_id,
        add_round.p_round_type_id,
        next_round_number,
        add_round.p_round_date,
        add_round.p_is_hit,
        add_round.p_coupon_url
    )
    RETURNING id INTO new_matchday_id;

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
            new_matchday_id,
            (pick_record->>'leagueId')::INT,
            (pick_record->>'odd')::NUMERIC,
            (pick_record->>'isHit')::BOOL,
            (pick_record->>'isChosen')::BOOL
        )
        RETURNING id INTO created_pick_id;

        pick_map := pick_map || jsonb_build_object(
            pick_record->>'playerId',
            created_pick_id
        );
    END LOOP;

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
