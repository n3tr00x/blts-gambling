create or replace function public.get_round_for_edit (p_matchday_id integer) returns table (
  "roundTypeId" integer,
  "roundDate" date,
  "roundNumber" integer,
  "isHit" boolean,
  picks jsonb,
  votes jsonb
) language plpgsql security definer as $$
begin
  return query
    select
      m.round_type_id       as "roundTypeId",
      m.match_date          as "roundDate",
      m.round_number        as "roundNumber",
      m.correct             as "isHit",
      (
        select coalesce(
          jsonb_agg(
            jsonb_build_object(
              'playerId', p.player_id,
              'leagueId', p.league_id,
              'odd', p.odds,
              'isChosen', p.is_chosen,
              'isHit', p.is_hit
            )
            order by p.player_id
          ),
          '[]'::jsonb
        )
        from public.picks p
        where p.matchday_id = m.id
      ) as picks,
      (
        select coalesce(
          jsonb_agg(
            jsonb_build_object(
              'voterId', v.player_id,
              'votesFor', v.votes_for
            )
            order by v.player_id
          ),
          '[]'::jsonb
        )
        from (
            select
              vt.player_id,
              jsonb_agg(pk.player_id order by pk.player_id) as votes_for
            from public.votes vt
            join public.picks pk on pk.id = vt.pick_id
            where pk.matchday_id = m.id
            group by vt.player_id
        ) v
      ) as votes
    from public.matchdays m
    where m.id = p_matchday_id;

    if not found then
        raise exception 'Matchday % nie istnieje', p_matchday_id;
    end if;
end;
$$;
