create or replace view "public"."seasons_with_current" as  SELECT id,
    name,
    start_date,
    end_date,
    ((CURRENT_DATE >= start_date) AND (CURRENT_DATE <= end_date)) AS is_current
   FROM seasons;



