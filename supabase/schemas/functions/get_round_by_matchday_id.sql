create or replace function public.get_round (matchday_id int) returns table (
  round_number int,
  round_type text,
  round_date date,
  is_hit boolean,
  season text,
  picks jsonb,
  votes jsonb
) language sql security definer as $$
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
                        'id', pl.id,
                        'username', pl.username
                    ),
                    'votes_for', coalesce(vf.players, '[]'::jsonb)
                )
                order by pl.username
            ),
            '[]'::jsonb
        )
        from public.players pl
        left join (
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
        ) vf on vf.voter_id = pl.id
    ) as votes

from public.matchdays m
join public.round_types rt on rt.id = m.round_type_id
join public.seasons s on s.id = m.season_id
where m.id = matchday_id;
$$;
