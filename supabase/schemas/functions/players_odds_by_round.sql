CREATE OR REPLACE FUNCTION players_odds_by_round (season_id INTEGER DEFAULT NULL) RETURNS TABLE (round_number INTEGER, data JSONB) LANGUAGE sql AS $$
WITH active_season AS (
  SELECT COALESCE(
    season_id,
    (
      SELECT id
      FROM seasons
      WHERE CURRENT_DATE BETWEEN start_date AND end_date
      ORDER BY start_date DESC
      LIMIT 1
    )     
  ) AS id
)
SELECT 
  m.round_number,
  jsonb_object_agg(p.username, pk.odds) AS data
FROM picks pk
JOIN players p ON pk.player_id = p.id
JOIN matchdays m ON pk.matchday_id = m.id
WHERE m.season_id = (SELECT id FROM active_season)
GROUP BY m.round_number
ORDER BY m.round_number ASC;
$$;
