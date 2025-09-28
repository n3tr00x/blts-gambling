INSERT INTO "public"."players" ("username") 
VALUES ('Wojos'), ('Shervil'), ('Karolix'), ('Jacula'), ('n3tr00x');

SELECT setval(
  pg_get_serial_sequence('players', 'id'),
  (SELECT MAX(id) FROM players)
);