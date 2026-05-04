CREATE OR REPLACE FUNCTION get_top_picked_leagues_by_players (season_id INT DEFAULT NULL) RETURNS TABLE (
  player TEXT,
  league TEXT,
  country TEXT,
  league_pick_count INTEGER,
  total_picks INTEGER
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
    COUNT(*) OVER (PARTITION BY p.id, l.id) AS league_pick_count,
    COUNT(*) OVER (PARTITION BY p.id) AS total_picks
  FROM picks pk
  JOIN leagues l ON pk.league_id = l.id
  JOIN players p ON pk.player_id = p.id
  WHERE pk.season_id = (SELECT season_to_use FROM selected_season)
  ORDER BY p.id, league_pick_count DESC;
$$;
