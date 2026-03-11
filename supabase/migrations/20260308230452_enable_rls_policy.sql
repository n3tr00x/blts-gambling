drop view if exists "public"."league_pick_stats_view";

alter table "public"."ako_coupons" enable row level security;

alter table "public"."leagues" enable row level security;

alter table "public"."matchdays" enable row level security;

alter table "public"."picks" enable row level security;

alter table "public"."players" enable row level security;

alter table "public"."round_types" enable row level security;

alter table "public"."seasons" enable row level security;

alter table "public"."votes" enable row level security;

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


create or replace view "public"."matchday_months" as  SELECT to_char(date_trunc('month'::text, (match_date)::timestamp with time zone), 'MM-YYYY'::text) AS month_key,
    count(*) AS matchdays_count
   FROM public.matchdays
  GROUP BY (date_trunc('month'::text, (match_date)::timestamp with time zone))
  ORDER BY (date_trunc('month'::text, (match_date)::timestamp with time zone)) DESC;



  create policy "AKO coupons are viewable by everyone"
  on "public"."ako_coupons"
  as permissive
  for select
  to public
using (true);



  create policy "Only authenticated users can delete AKO coupons"
  on "public"."ako_coupons"
  as permissive
  for delete
  to public
using ((auth.uid() IS NOT NULL));



  create policy "Only authenticated users can insert AKO coupons"
  on "public"."ako_coupons"
  as permissive
  for insert
  to public
with check ((auth.uid() IS NOT NULL));



  create policy "Only authenticated users can update AKO coupons"
  on "public"."ako_coupons"
  as permissive
  for update
  to public
using ((auth.uid() IS NOT NULL))
with check ((auth.uid() IS NOT NULL));



  create policy "Leagues are viewable by everyone"
  on "public"."leagues"
  as permissive
  for select
  to public
using (true);



  create policy "Only authenticated users can delete leagues"
  on "public"."leagues"
  as permissive
  for delete
  to public
using ((auth.uid() IS NOT NULL));



  create policy "Only authenticated users can insert leagues"
  on "public"."leagues"
  as permissive
  for insert
  to public
with check ((auth.uid() IS NOT NULL));



  create policy "Only authenticated users can update leagues"
  on "public"."leagues"
  as permissive
  for update
  to public
using ((auth.uid() IS NOT NULL))
with check ((auth.uid() IS NOT NULL));



  create policy "Matchdays are viewable by everyone"
  on "public"."matchdays"
  as permissive
  for select
  to public
using (true);



  create policy "Only authenticated users can delete matchdays"
  on "public"."matchdays"
  as permissive
  for delete
  to public
using ((auth.uid() IS NOT NULL));



  create policy "Only authenticated users can insert matchdays"
  on "public"."matchdays"
  as permissive
  for insert
  to public
with check ((auth.uid() IS NOT NULL));



  create policy "Only authenticated users can update matchdays"
  on "public"."matchdays"
  as permissive
  for update
  to public
using ((auth.uid() IS NOT NULL))
with check ((auth.uid() IS NOT NULL));



  create policy "Only authenticated users can delete picks"
  on "public"."picks"
  as permissive
  for delete
  to public
using ((auth.uid() IS NOT NULL));



  create policy "Only authenticated users can insert picks"
  on "public"."picks"
  as permissive
  for insert
  to public
with check ((auth.uid() IS NOT NULL));



  create policy "Only authenticated users can update picks"
  on "public"."picks"
  as permissive
  for update
  to public
using ((auth.uid() IS NOT NULL))
with check ((auth.uid() IS NOT NULL));



  create policy "Picks are viewable by everyone"
  on "public"."picks"
  as permissive
  for select
  to public
using (true);



  create policy "Only authenticated users can delete players"
  on "public"."players"
  as permissive
  for delete
  to public
using ((auth.uid() IS NOT NULL));



  create policy "Only authenticated users can insert players"
  on "public"."players"
  as permissive
  for insert
  to public
with check ((auth.uid() IS NOT NULL));



  create policy "Only authenticated users can update players"
  on "public"."players"
  as permissive
  for update
  to public
using ((auth.uid() IS NOT NULL))
with check ((auth.uid() IS NOT NULL));



  create policy "Players are viewable by everyone"
  on "public"."players"
  as permissive
  for select
  to public
using (true);



  create policy "Only authenticated users can delete round types"
  on "public"."round_types"
  as permissive
  for delete
  to public
using ((auth.uid() IS NOT NULL));



  create policy "Only authenticated users can insert round types"
  on "public"."round_types"
  as permissive
  for insert
  to public
with check ((auth.uid() IS NOT NULL));



  create policy "Only authenticated users can update round types"
  on "public"."round_types"
  as permissive
  for update
  to public
using ((auth.uid() IS NOT NULL))
with check ((auth.uid() IS NOT NULL));



  create policy "Round types are viewable by everyone"
  on "public"."round_types"
  as permissive
  for select
  to public
using (true);



  create policy "Only authenticated users can delete seasons"
  on "public"."seasons"
  as permissive
  for delete
  to public
using ((auth.uid() IS NOT NULL));



  create policy "Only authenticated users can insert seasons"
  on "public"."seasons"
  as permissive
  for insert
  to public
with check ((auth.uid() IS NOT NULL));



  create policy "Only authenticated users can update seasons"
  on "public"."seasons"
  as permissive
  for update
  to public
using ((auth.uid() IS NOT NULL))
with check ((auth.uid() IS NOT NULL));



  create policy "Seasons are viewable by everyone"
  on "public"."seasons"
  as permissive
  for select
  to public
using (true);



  create policy "Only authenticated users can delete votes"
  on "public"."votes"
  as permissive
  for delete
  to public
using ((auth.uid() IS NOT NULL));



  create policy "Only authenticated users can insert votes"
  on "public"."votes"
  as permissive
  for insert
  to public
with check ((auth.uid() IS NOT NULL));



  create policy "Only authenticated users can update votes"
  on "public"."votes"
  as permissive
  for update
  to public
using ((auth.uid() IS NOT NULL))
with check ((auth.uid() IS NOT NULL));



  create policy "Votes are viewable by everyone"
  on "public"."votes"
  as permissive
  for select
  to public
using (true);



