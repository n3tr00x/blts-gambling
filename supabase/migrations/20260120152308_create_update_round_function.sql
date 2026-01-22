CREATE UNIQUE INDEX uniq_pick_per_player_per_round ON public.picks USING btree (player_id, matchday_id);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.update_round(matchday_id integer, round_type_id integer, round_date date, is_hit boolean, picks_input jsonb, votes_input jsonb)
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
    where id = update_round.matchday_id;

    if detected_season_id is null then
        raise exception 'Matchday % nie istnieje', update_round.matchday_id;
    end if;

    update public.matchdays
    set
        round_type_id = update_round.round_type_id,
        match_date = update_round.round_date,
        correct = update_round.is_hit
    where id = update_round.matchday_id;

    delete from public.votes v
    using public.picks p
    where p.id = v.pick_id
      and p.matchday_id = update_round.matchday_id;

    for pick_record in
        select * from jsonb_array_elements(update_round.picks_input)
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
            update_round.matchday_id,
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
    where matchday_id = update_round.matchday_id
      and player_id not in (
          select (p->>'playerId')::int
          from jsonb_array_elements(update_round.picks_input) p
      );

    for vote_record in
        select * from jsonb_array_elements(update_round.votes_input)
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


