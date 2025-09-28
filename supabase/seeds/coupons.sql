INSERT INTO "public"."ako_coupons" ("creator_id", "ako_round_number", "season_id", "total_odds", "hit_count", "is_hit", "link") 
VALUES 
('4', '1', '1', '71.59', '5', 'false', 'https://applink.efortuna.pl/ticketdetail?id=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJQRlAwSlpCN1o0QTFUODAwIiwicHJmIjoiUFVCTElDIiwiaXNzIjoiZm9ydHVuYXdlYiJ9.Nz_FurdgEc3eklWtHMjW1lLOcSHCuii6f6RIMXrjHrc&source=SB&deeplink=ftnpl%3A%2F%2Fbetslip-history%2Fdetail%3Fid%3DeyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJQRlAwSlpCN1o0QTFUODAwIiwicHJmIjoiUFVCTElDIiwiaXNzIjoiZm9ydHVuYXdlYiJ9.Nz_FurdgEc3eklWtHMjW1lLOcSHCuii6f6RIMXrjHrc%26source%3DSB'), 
('3', '1', '1', '34.16', '10', 'true', 'https://www.efortuna.pl/ticketdetail?id=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJQRlAwSzNZS05YVkEwODAwIiwicHJmIjoiUFVCTElDIiwiaXNzIjoiZm9ydHVuYXdlYiJ9.28k_RVYZxXYKhx-BWitgW60yW2cdhEp33NmOPgEvgnA&source=SB'), 
('1', '1', '1', '45.01', '6', 'false', 'https://www.efortuna.pl/ticketdetail?id=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJQRlAwSzc0UlNRNlZKRzAwIiwicHJmIjoiUFVCTElDIiwiaXNzIjoiZm9ydHVuYXdlYiJ9.YanDJ0u4Rs8ZwfWOjHS1TNCaAisi5Otjjau0L3VOepY&source=SB'), 
('2', '1', '1', '54.15', '5', 'false', 'https://applink.efortuna.pl/ticketdetail?id=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJQRlAwS0M2NVJKUUtaMDAwIiwicHJmIjoiUFVCTElDIiwiaXNzIjoiYmV0c2xpcC1zZXJ2aWNlIiwiaWF0IjoxNzU1NzcyMTE0fQ.Km4FYcpE7FZJVoFCHVk1RUmRkNu_W4Q0pJFQHXreHPk&source=SB&deeplink=ftnpl%3A%2F%2Fbetslip-history%2Fdetail%3Fid%3DeyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJQRlAwS0M2NVJKUUtaMDAwIiwicHJmIjoiUFVCTElDIiwiaXNzIjoiYmV0c2xpcC1zZXJ2aWNlIiwiaWF0IjoxNzU1NzcyMTE0fQ.Km4FYcpE7FZJVoFCHVk1RUmRkNu_W4Q0pJFQHXreHPk%26source%3DSB');

SELECT setval(
  pg_get_serial_sequence('ako_coupons', 'id'),
  (SELECT MAX(id) FROM ako_coupons)
);