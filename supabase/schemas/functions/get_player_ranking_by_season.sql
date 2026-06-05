CREATE OR REPLACE FUNCTION get_player_ranking_by_season (season_id INT DEFAULT NULL) RETURNS TABLE (
  username TEXT,
  hit_picks INTEGER,
  total_picks INTEGER,
  effectiveness NUMERIC,
  avg_odds NUMERIC,
  total_votes INTEGER,
  points NUMERIC
) LANGUAGE sql AS $$
  WITH selected_season AS (
    SELECT COALESCE(
      season_id,
      (SELECT id FROM seasons_with_current WHERE is_current = true LIMIT 1),
      (SELECT id FROM seasons ORDER BY start_date DESC LIMIT 1)
    ) AS season_to_use
  ),
  picks_stats AS (
    SELECT
      pk.player_id,
      COUNT(*) AS total_picks,
      SUM(CASE WHEN pk.is_hit THEN 1 ELSE 0 END) AS hit_picks,
      ROUND(AVG(CASE WHEN pk.is_hit THEN pk.odds END), 2) AS avg_odds_hit,
      ROUND(SUM(CASE WHEN pk.is_hit THEN pk.odds ELSE 0 END), 2) AS sum_odds_hit
    FROM picks pk
    WHERE pk.season_id = (SELECT season_to_use FROM selected_season)
    GROUP BY pk.player_id
  ),
  season_matchdays_count AS (
    SELECT COUNT(*) AS matchdays_in_season
    FROM matchdays m
    WHERE m.season_id = (SELECT season_to_use FROM selected_season)
  ),
  votes_stats AS (
    SELECT
      pk.player_id,
      COUNT(v.id) AS total_votes
    FROM picks pk
    LEFT JOIN votes v
      ON v.pick_id = pk.id
    WHERE pk.season_id = (SELECT season_to_use FROM selected_season)
    GROUP BY pk.player_id
  ),
  player_stats AS (
    SELECT
      p.id AS player_id,
      p.username,
      COALESCE(ps.hit_picks, 0) AS hit_picks,
      COALESCE(ps.total_picks, 0) AS total_picks,
      ps.avg_odds_hit AS avg_odds_hit,
      ps.sum_odds_hit AS sum_odds_hit,
      COALESCE(vs.total_votes, 0) AS total_votes,
      (SELECT matchdays_in_season FROM season_matchdays_count) AS matchdays_count
    FROM players p
    LEFT JOIN picks_stats ps ON ps.player_id = p.id
    LEFT JOIN votes_stats vs ON vs.player_id = p.id
  )
  SELECT
    username,
    hit_picks,
    total_picks,
    CASE
      WHEN total_picks > 0 THEN ROUND((hit_picks::numeric / total_picks) * 100, 2)
      ELSE 0
    END AS effectiveness,
    avg_odds_hit AS avg_odds,
    total_votes,
    ROUND(COALESCE(sum_odds_hit, 0) + COALESCE(total_picks, 0) - matchdays_count, 2) AS points
  FROM player_stats;
$$;
