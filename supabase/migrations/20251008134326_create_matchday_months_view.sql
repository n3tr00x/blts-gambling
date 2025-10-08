create or replace view "public"."matchday_months" as  SELECT to_char((match_date)::timestamp with time zone, 'MM-YYYY'::text) AS month_key,
    count(*) AS matchdays_count
   FROM matchdays
  GROUP BY (to_char((match_date)::timestamp with time zone, 'MM-YYYY'::text))
  ORDER BY (to_char((match_date)::timestamp with time zone, 'MM-YYYY'::text)) DESC;



