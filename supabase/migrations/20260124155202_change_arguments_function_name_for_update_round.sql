drop function if exists "public"."update_round"(matchday_id integer, round_type_id integer, round_date date, is_hit boolean, picks_input jsonb, votes_input jsonb);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.update_round(p_matchday_id integer, p_round_type_id integer, p_round_date date, p_is_hit boolean, p_picks jsonb, p_votes jsonb)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
    detected_season_id integer;
    pick_record jsonb;
    vote_record jsonb;
    created_pick_id integer;
    pick_map jsonb := '{}'::jsonb;

begin
    select season_id
    into detected_season_id
    from public.matchdays
    where id = p_matchday_id;

    if detected_season_id is null then
        raise exception 'Matchday % nie istnieje', p_matchday_id;
    end if;

    update public.matchdays
    set
        round_type_id = p_round_type_id,
        match_date = p_round_date,
        correct = p_is_hit
    where id = p_matchday_id;

    delete from public.votes v
    using public.picks p
    where p.id = v.pick_id
      and p.matchday_id = p_matchday_id;

    for pick_record in
        select * from jsonb_array_elements(p_picks)
    loop
        insert into public.picks (
            player_id,
            season_id,
            matchday_id,
            league_id,
            odds,
            is_hit,
            is_chosen
        )
        values (
            (pick_record->>'playerId')::int,
            detected_season_id,
            p_matchday_id,
            (pick_record->>'leagueId')::int,
            (pick_record->>'odd')::numeric,
            (pick_record->>'isHit')::bool,
            (pick_record->>'isChosen')::bool
        )
        on conflict (player_id, matchday_id)
        do update set
            league_id = excluded.league_id,
            odds = excluded.odds,
            is_hit = excluded.is_hit,
            is_chosen = excluded.is_chosen
        returning id into created_pick_id;

        pick_map := pick_map || jsonb_build_object(
            pick_record->>'playerId',
            created_pick_id
        );
    end loop;

    delete from public.picks
    where matchday_id = p_matchday_id
      and player_id not in (
          select (p->>'playerId')::int
          from jsonb_array_elements(p_picks) p
      );

    for vote_record in
        select * from jsonb_array_elements(p_votes)
    loop
        declare
            voter_id int := (vote_record->>'voterId')::int;
            voted_player_id_text text;
            voted_pick_id int;
        begin
            for voted_player_id_text in
                select jsonb_array_elements_text(vote_record->'votesFor')
            loop
                voted_pick_id := (pick_map ->> voted_player_id_text)::int;

                if voted_pick_id is not null then
                    insert into public.votes (player_id, pick_id)
                    values (voter_id, voted_pick_id);
                end if;
            end loop;
        end;
    end loop;

end;
$function$
;


