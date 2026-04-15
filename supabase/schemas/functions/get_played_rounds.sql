CREATE OR REPLACE FUNCTION get_played_rounds () RETURNS TABLE (
  id INTEGER,
  round_number INTEGER,
  match_date DATE,
  round_type TEXT,
  round_type_id INTEGER,
  season_name TEXT,
  season_id INTEGER,
  correct BOOLEAN
) LANGUAGE sql AS $$
SELECT 
    m.id,
    m.round_number,
    m.match_date,
    rt.name AS round_type,
    m.round_type_id,
    s.name AS season_name,
    m.season_id,
    m.correct
FROM matchdays m
JOIN seasons s ON m.season_id = s.id
JOIN round_types rt ON m.round_type_id = rt.id
WHERE m.match_date <= CURRENT_DATE
ORDER BY s.start_date DESC, m.round_number ASC;
$$;
