INSERT INTO "public"."seasons" ("id", "name", "start_date", "end_date") 
VALUES ('1', 'Sezon 1', '2025-07-01', '2026-06-30');

SELECT setval(
  pg_get_serial_sequence('seasons', 'id'),
  (SELECT MAX(id) FROM seasons)
);