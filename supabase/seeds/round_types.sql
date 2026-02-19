INSERT INTO
  "public"."round_types" ("id", "name")
VALUES
  ('1', '30'),
  ('2', 'FREEBET'),
  ('3', 'DOKŁADKA'),
  ('4', 'SNAJPER'),
  ('5', 'SPARING'),
  ('6', '50'),
  ('7', '25'),
  ('8', 'BONUS'),
  ('9', '20 SUPERBET'),
  ('10', 'FREEBET SUPERBET'),
  ('11', '40 YELLOW FRIDAY'),
  ('12', 'BONUS(NIESPOZAKŁAD)'),
  ('13', 'FARCIARZ');

SELECT
  setval(
    pg_get_serial_sequence('round_types', 'id'),
    (
      SELECT
        MAX(id)
      FROM
        round_types
    )
  );
