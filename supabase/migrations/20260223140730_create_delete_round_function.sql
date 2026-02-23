alter table "public"."picks" drop constraint "picks_matchday_id_fkey";

alter table "public"."votes" drop constraint "votes_pick_id_fkey";

drop view if exists "public"."league_pick_stats_view";

alter table "public"."picks" add constraint "picks_matchday_id_fkey" FOREIGN KEY (matchday_id) REFERENCES public.matchdays(id) ON DELETE CASCADE not valid;

alter table "public"."picks" validate constraint "picks_matchday_id_fkey";

alter table "public"."votes" add constraint "votes_pick_id_fkey" FOREIGN KEY (pick_id) REFERENCES public.picks(id) ON DELETE CASCADE not valid;

alter table "public"."votes" validate constraint "votes_pick_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.delete_round(p_matchday_id integer)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  DELETE FROM public.matchdays WHERE id = p_matchday_id;
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



