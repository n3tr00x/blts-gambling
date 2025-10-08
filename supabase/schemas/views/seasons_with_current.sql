CREATE VIEW seasons_with_current AS
  SELECT id, name, start_date, end_date,
  (CURRENT_DATE BETWEEN start_date AND end_date) AS is_current
FROM seasons; 