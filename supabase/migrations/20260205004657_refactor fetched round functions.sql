drop function if exists "public"."add_round"(round_type_id integer, round_date date, is_hit boolean, picks_input jsonb, votes_input jsonb);

drop function if exists "public"."get_round"(matchday_id integer);

drop function if exists "public"."update_round"(p_matchday_id integer, p_round_type_id integer, p_round_date date, p_is_hit boolean, p_picks jsonb, p_votes jsonb);

drop function if exists "public"."get_round_for_edit"(p_matchday_id integer);

drop view if exists "public"."league_pick_stats_view";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.add_round(round_type_id integer, round_date date, is_hit boolean, picks_input jsonb, votes_input jsonb, related_matchday_id integer DEFAULT NULL::integer)
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
    WHERE s.start_date <= round_date
      AND s.end_date >= round_date
    LIMIT 1;

    IF detected_season_id IS NULL THEN
        RAISE EXCEPTION 'Brak sezonu obejmującego datę %', round_date;
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
        add_round.related_matchday_id,
        add_round.round_type_id,
        next_round_number,
        add_round.round_date,
        add_round.is_hit
    )
    RETURNING id INTO new_matchday_id;

    FOR pick_record IN
        SELECT * FROM jsonb_array_elements(picks_input)
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
        SELECT * FROM jsonb_array_elements(votes_input)
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

CREATE OR REPLACE FUNCTION public.get_round(p_matchday_id integer)
 RETURNS TABLE(round_number integer, round_type text, round_date date, is_hit boolean, season text, related_matchday_id integer, picks jsonb, votes jsonb)
 LANGUAGE sql
 SECURITY DEFINER
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.update_round(p_matchday_id integer, p_round_type_id integer, p_round_date date, p_is_hit boolean, p_picks jsonb, p_votes jsonb, p_related_matchday_id integer DEFAULT NULL::integer)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.get_round_for_edit(p_matchday_id integer)
 RETURNS TABLE(round_type_id integer, round_date date, round_number integer, is_hit boolean, related_matchday_id integer, picks jsonb, votes jsonb)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
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



