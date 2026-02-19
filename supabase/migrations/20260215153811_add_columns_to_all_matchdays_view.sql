drop view if exists "public"."league_pick_stats_view";

create or replace view "public"."all_matchdays_for_selection" as  SELECT m.id,
    m.season_id,
    m.round_number,
    m.match_date,
    m.correct,
    m.related_matchday_id,
    rt.name AS round_type
   FROM (public.matchdays m
     JOIN public.round_types rt ON ((rt.id = m.round_type_id)));


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



