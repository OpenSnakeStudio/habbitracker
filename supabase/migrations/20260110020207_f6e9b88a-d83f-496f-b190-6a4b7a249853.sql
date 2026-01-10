-- Add custom theme rewards to the shop
INSERT INTO rewards_shop (name, description, price_stars, reward_type, reward_value, is_active)
VALUES 
  ('Тёмная тема "Ночь"', 'Глубокая тёмная тема с фиолетовыми акцентами', 100, 'theme', '{"theme_id": "night_purple"}', true),
  ('Тема "Закат"', 'Теплая тема с оранжево-розовыми оттенками', 150, 'theme', '{"theme_id": "sunset"}', true),
  ('Тема "Океан"', 'Свежая тема с голубыми и бирюзовыми тонами', 150, 'theme', '{"theme_id": "ocean"}', true),
  ('Тема "Лес"', 'Природная тема с зелёными оттенками', 120, 'theme', '{"theme_id": "forest"}', true),
  ('Тема "Кибер"', 'Футуристичная неоновая тема', 200, 'theme', '{"theme_id": "cyber"}', true)
ON CONFLICT DO NOTHING;