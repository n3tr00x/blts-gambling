drop function if exists "public"."add_round"(round_type_id integer, round_date date, is_hit boolean, picks_input jsonb, votes_input jsonb, related_matchday_id integer);

drop view if exists "public"."league_pick_stats_view";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.add_round(p_round_type_id integer, p_round_date date, p_is_hit boolean, p_picks jsonb, p_votes jsonb, p_related_matchday_id integer DEFAULT NULL::integer)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
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
        correct
    )
    VALUES (
        detected_season_id,
        add_round.p_related_matchday_id,
        add_round.p_round_type_id,
        next_round_number,
        add_round.p_round_date,
        add_round.p_is_hit
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
$function$
;

create or replace view "public"."league_pick_stats_view" as  WITH league_stats AS (
         SELECT l.id,
            l.name AS league_name,
            l.country,
            l.level,
            count(p.id) AS pick_count,
            count(*) FILTER (WHERE (p.is_hit = true)) AS hit_count
           FROM (public.leagues l
             LEFT JOIN public.picks p ON ((p.league_id = l.id)))
          GROUP BY l.id, l.name, l.country, l.level
        ), total AS (
         SELECT sum(league_stats.pick_count) AS total_picks
           FROM league_stats
        )
 SELECT ls.league_name,
    ls.country,
    ls.level,
    ls.pick_count,
    ls.hit_count,
    t.total_picks
   FROM (league_stats ls
     CROSS JOIN total t)
  WHERE (ls.pick_count > 0)
  ORDER BY ls.pick_count DESC;



