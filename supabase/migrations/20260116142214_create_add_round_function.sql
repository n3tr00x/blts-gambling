set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.add_round(round_type_id integer, round_date date, is_hit boolean, picks_input jsonb, votes_input jsonb)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
    new_matchday_id integer;
    detected_season_id integer;
    next_round_number integer;

    pick_record jsonb;
    vote_record jsonb;
    created_pick_id integer;

    pick_map jsonb := '{}'::jsonb;

begin
    select s.id
    into detected_season_id
    from public.seasons s
    where s.start_date <= round_date
      and s.end_date >= round_date
    limit 1;

    if detected_season_id is null then
        raise exception 'Brak sezonu obejmującego datę %', round_date;
    end if;

    select coalesce(max(m.round_number), 0) + 1
    into next_round_number
    from public.matchdays m
    where m.season_id = detected_season_id;

    insert into public.matchdays (
        season_id,
        related_matchday_id,
        round_type_id,
        round_number,
        match_date,
        correct
    )
    values (
        detected_season_id,
        null,
        add_round.round_type_id,
        next_round_number,
        add_round.round_date,
        add_round.is_hit
    )
    returning id into new_matchday_id;

    for pick_record in
        select * from jsonb_array_elements(picks_input)
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
            new_matchday_id,
            (pick_record->>'leagueId')::int,
            (pick_record->>'odd')::numeric,
            (pick_record->>'isHit')::bool,
            (pick_record->>'isChosen')::bool
        )
        returning id into created_pick_id;

        pick_map := pick_map || jsonb_build_object(
            pick_record->>'playerId',
            created_pick_id
        );
    end loop;

    for vote_record in
        select * from jsonb_array_elements(votes_input)
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


