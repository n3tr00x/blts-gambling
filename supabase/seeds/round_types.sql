INSERT INTO public.round_types (name)
VALUES
  ('30'),
  ('FREEBET'),
  ('DOKŁADKA'),
  ('SNAJPER'),
  ('SPARING'),
  ('50'),
  ('25'),
  ('BONUS');

SELECT setval(
  pg_get_serial_sequence('round_types', 'id'),
  (SELECT MAX(id) FROM round_types)
);