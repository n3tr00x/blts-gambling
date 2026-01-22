set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_round(matchday_id integer)
 RETURNS TABLE(round_number integer, round_type text, round_date date, is_hit boolean, season text, picks jsonb, votes jsonb)
 LANGUAGE sql
 SECURITY DEFINER
AS $function$
    select
        m.round_number,
        rt.name as round_type,
        m.match_date as round_date,
        m.correct as is_hit,
        s.name as season,
        (
        select coalesce(
			jsonb_agg(
				jsonb_build_object(
					'player', jsonb_build_object(
						'id', pl.id,
						'username', pl.username
					),
					'league', jsonb_build_object(
						'id', l.id,
						'name', l.name,
						'country', l.country
					),
					'odd', p.odds,
					'is_chosen', p.is_chosen,
					'is_hit', p.is_hit
				)
			order by pl.username
			),
			'[]'::jsonb
		)
		from public.picks p
		join public.players pl on pl.id = p.player_id
		join public.leagues l on l.id = p.league_id
		where p.matchday_id = m.id
        ) as picks,
        (
            select coalesce(
                jsonb_agg(
                    jsonb_build_object(
                        'voter', jsonb_build_object(
                            'id', voter.id,
                            'username', voter.username
                        ),
                        'votes_for', votes_for.players
                    )
                order by voter.username
                ),
            	'[]'::jsonb
            )
            from (
                select
                    v.player_id as voter_id,
                    jsonb_agg(
                        jsonb_build_object(
                            'id', p2.id,
                            'username', p2.username
                        )
                        order by p2.username
                    ) as players
                from public.votes v
                join public.picks pk on pk.id = v.pick_id
                join public.players p2 on p2.id = pk.player_id
                where pk.matchday_id = m.id
                group by v.player_id
            ) votes_for
            join public.players voter on voter.id = votes_for.voter_id
        ) as votes
    from public.matchdays m
    join public.round_types rt on rt.id = m.round_type_id
    join public.seasons s on s.id = m.season_id
    where m.id = matchday_id;
$function$
;

CREATE OR REPLACE FUNCTION public.players_odds_by_round(season_id integer DEFAULT NULL::integer)
 RETURNS TABLE(round_number integer, data jsonb)
 LANGUAGE sql
AS $function$
WITH active_season AS (
  SELECT COALESCE(
    season_id,
    (
      SELECT id
      FROM seasons
      WHERE CURRENT_DATE BETWEEN start_date AND end_date
      ORDER BY start_date DESC
      LIMIT 1
    )     
  ) AS id
)
SELECT 
  m.round_number,
  jsonb_object_agg(p.username, pk.odds) AS data
FROM picks pk
JOIN players p ON pk.player_id = p.id
JOIN matchdays m ON pk.matchday_id = m.id
WHERE m.season_id = (SELECT id FROM active_season)
GROUP BY m.round_number
ORDER BY m.round_number ASC;
$function$
;


