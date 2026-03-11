-- Drop existing views and recreate them with security_invoker
DROP VIEW IF EXISTS public.all_matchdays_for_selection;

DROP VIEW IF EXISTS public.league_pick_stats_view;

DROP VIEW IF EXISTS public.matchday_months;

DROP VIEW IF EXISTS public.seasons_with_current;

-- Recreate all_matchdays_for_selection with security_invoker
CREATE VIEW public.all_matchdays_for_selection
WITH
  (security_invoker = ON) AS
SELECT
  m.id,
  m.season_id,
  m.round_number,
  m.match_date,
  m.correct,
  m.related_matchday_id,
  rt.name AS round_type
FROM
  public.matchdays m
  INNER JOIN public.round_types rt ON rt.id = m.round_type_id;

-- Recreate league_pick_stats_view with security_invoker
CREATE OR REPLACE VIEW public.league_pick_stats_view
WITH
  (security_invoker = ON) AS
WITH
  league_stats AS (
    SELECT
      l.id,
      l.name AS league_name,
      l.country,
      l.level,
      COUNT(p.id) AS pick_count,
      COUNT(*) FILTER (
        WHERE
          p.is_hit = TRUE
      ) AS hit_count
    FROM
      leagues l
      LEFT JOIN picks p ON p.league_id = l.id
    GROUP BY
      l.id,
      l.name,
      l.country,
      l.level
  ),
  total AS (
    SELECT
      SUM(pick_count) AS total_picks
    FROM
      league_stats
  )
SELECT
  ls.league_name,
  ls.country,
  ls.level,
  ls.pick_count,
  ls.hit_count,
  t.total_picks
FROM
  league_stats ls
  CROSS JOIN total t
WHERE
  ls.pick_count > 0
ORDER BY
  ls.pick_count DESC;

-- Recreate matchday_months with security_invoker
CREATE OR REPLACE VIEW public.matchday_months
WITH
  (security_invoker = ON) AS
SELECT
  TO_CHAR(DATE_TRUNC('month', match_date), 'MM-YYYY') AS month_key,
  COUNT(*) AS matchdays_count
FROM
  matchdays
GROUP BY
  DATE_TRUNC('month', match_date)
ORDER BY
  DATE_TRUNC('month', match_date) DESC;

-- Recreate seasons_with_current with security_invoker
CREATE VIEW public.seasons_with_current
WITH
  (security_invoker = ON) AS
SELECT
  id,
  name,
  start_date,
  end_date,
  (CURRENT_DATE BETWEEN start_date AND end_date) AS is_current
FROM
  seasons;
