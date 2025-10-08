alter table "public"."leagues" add column "code" text;

alter table "public"."picks" alter column "league_id" drop not null;

create or replace view "public"."matchday_months" as  SELECT to_char((match_date)::timestamp with time zone, 'YYYY-MM'::text) AS month_key,
    count(*) AS matchdays_count
   FROM matchdays
  GROUP BY (to_char((match_date)::timestamp with time zone, 'YYYY-MM'::text))
  ORDER BY (to_char((match_date)::timestamp with time zone, 'YYYY-MM'::text)) DESC;



