CREATE OR REPLACE VIEW matchday_months AS
SELECT 
    TO_CHAR(match_date, 'MM-YYYY') AS month_key,
    COUNT(*) AS matchdays_count
FROM matchdays
GROUP BY month_key
ORDER BY month_key DESC;