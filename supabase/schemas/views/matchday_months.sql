CREATE OR REPLACE VIEW matchday_months AS
SELECT
  TO_CHAR(DATE_TRUNC('month', match_date), 'MM-YYYY') AS month_key,
  COUNT(*) AS matchdays_count
FROM
  matchdays
GROUP BY
  DATE_TRUNC('month', match_date)
ORDER BY
  DATE_TRUNC('month', match_date) DESC;
