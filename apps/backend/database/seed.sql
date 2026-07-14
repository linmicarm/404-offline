INSERT INTO spawn_points (name, category, neighborhood, address, is_marta_accessible) VALUES
  ('Battle & Brew', 'Gaming venue', 'Sandy Springs', '1489 Dunwoody Village Pkwy, Sandy Springs, GA 30338', false),
  ('Oxford Comics & Games', 'Comics & cards', 'Buckhead', '2855 Piedmont Rd NE, Atlanta, GA 30305', false),
  ('Matcha Cafe Maiko', 'Boba & matcha', 'Doraville', '5671 Buford Hwy NE, Doraville, GA 30340', false),
  ('Fluffy Fluffy', 'Cute cafe', 'Doraville', '5001 Buford Hwy NE, Doraville, GA 30340', false),
  ('Tokyo Kuma', 'Kawaii shop', 'Buford Highway', '5150 Buford Hwy NE, Doraville, GA 30340', false),
  ('Giga-Bites Cafe', 'Comics & cards', 'Marietta', '1985 Cobb Pkwy SE, Marietta, GA 30060', false),
  ('Joystick Game Bar', 'Gaming venue', 'Old Fourth Ward', '427 Edgewood Ave SE, Atlanta, GA 30312', true),
  ('My Parent''s Basement', 'Comics & cards', 'Avondale Estates', '5 N Avondale Rd, Avondale Estates, GA 30002', false);

INSERT INTO side_quests (spawn_point_id, name, description, date, time, cost, is_free, is_beginner_friendly, category, tags) VALUES
  (2, 'Friday Night Magic — Standard', 'Weekly MTG tournament open to all skill levels. Bring your standard deck or borrow one at the shop.', '2026-05-23', '7:00 PM', 0, true, true, 'Gaming', 'MTG,cards,tournament'),
  (6, 'Pokémon League — All Skill Levels', 'Casual Pokémon TCG league night. Beginners welcome, loaner decks available.', '2026-05-24', '12:00 PM', 0, true, true, 'Gaming', 'Pokemon,cards,casual'),
  (3, 'Matcha & Manga Morning', 'Bring your favorite manga volume and enjoy matcha together. All genres welcome.', '2026-05-24', '10:00 AM', 0, true, true, 'Social', 'manga,matcha,chill'),
  (7, 'Cosplay Meetup @ Joystick', 'Casual cosplay hangout between con seasons. All fandoms and skill levels welcome.', '2026-05-25', '2:00 PM', 0, true, true, 'Cosplay', 'cosplay,casual,social'),
  (1, 'Tekken 8 Weekly — Warrior Wednesday', 'Competitive Tekken 8 tournament. Cash prize for top 3. 21+ only.', '2026-05-27', '8:00 PM', 5, false, false, 'Gaming', 'FGC,Tekken,competitive'),
  (3, 'Japanese Language Exchange', 'Casual Japanese conversation practice for all levels. Native and learner speakers welcome.', '2026-05-27', '6:30 PM', 0, true, true, 'Language', 'Japanese,language,social'),
  (6, 'D&D Open Table — One Shot', 'Drop-in D&D one-shot adventure. No experience needed, characters provided.', '2026-05-28', '6:00 PM', 0, true, true, 'Tabletop', 'DnD,tabletop,beginner'),
  (2, 'Pokémon Go Community Day', 'Group up for Community Day at the park nearby. All trainers welcome.', '2026-06-01', '11:00 AM', 0, true, true, 'Gaming', 'Pokemon,mobile,outdoors');