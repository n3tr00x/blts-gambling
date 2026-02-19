CREATE VIEW all_matchdays_for_selection AS
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
