set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_played_rounds()
 RETURNS TABLE(id integer, round_number integer, match_date date, round_type text, season_name text, correct boolean)
 LANGUAGE sql
AS $function$
SELECT 
    m.id,
    m.round_number,
    m.match_date,
    rt.name AS round_type,
    s.name AS season_name,
    m.correct
FROM matchdays m
JOIN seasons s ON m.season_id = s.id
JOIN round_types rt ON m.round_type_id = rt.id
WHERE m.match_date <= CURRENT_DATE
ORDER BY s.start_date DESC, m.round_number ASC;
$function$
;


