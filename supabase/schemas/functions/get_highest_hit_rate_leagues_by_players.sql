CREATE OR REPLACE FUNCTION get_highest_hit_rate_leagues_by_players (
  season_id INT DEFAULT NULL,
  min_picks INT DEFAULT 15
) RETURNS TABLE (
  player TEXT,
  league TEXT,
  country TEXT,
  pick_count INTEGER,
  hit_picks INTEGER
) LANGUAGE sql AS $$
  WITH selected_season AS (
    SELECT COALESCE(
      season_id,
      (SELECT id FROM seasons_with_current WHERE is_current = true LIMIT 1),
      (SELECT id FROM seasons ORDER BY start_date DESC LIMIT 1)
    ) AS season_to_use
  )
  SELECT DISTINCT ON (p.id)
    p.username AS player,
    l.name AS league,
    l.country AS country,
    COUNT(*) AS pick_count,
    COUNT(CASE WHEN pk.is_hit THEN 1 END) AS hit_picks
  FROM picks pk
  JOIN leagues l ON pk.league_id = l.id
  JOIN players p ON pk.player_id = p.id
  WHERE pk.season_id = (SELECT season_to_use FROM selected_season)
  GROUP BY p.id, p.username, l.id, l.name, l.country
  HAVING COUNT(*) >= min_picks
  ORDER BY p.id DESC;
$$;
