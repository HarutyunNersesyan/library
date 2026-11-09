-- Demo history only: on a new installation this creates 5 active reservations
-- and 7 previously returned books. Book IDs correspond to Book Service seed migrations.
-- Dates are relative to first database migration so the demo is always recent.
INSERT INTO borrowings (book_id, book_title, borrower_name, borrowed_at, returned_at) VALUES
    (1, 'Փոքրիկ իշխանը', 'Անի Սարգսյան', CURRENT_TIMESTAMP - INTERVAL '3 days', NULL),
    (2, '1984', 'Դավիթ Մկրտչյան', CURRENT_TIMESTAMP - INTERVAL '14 days', NULL),
    (3, 'Ալքիմիկոսը', 'Մարիամ Գրիգորյան', CURRENT_TIMESTAMP - INTERVAL '20 days', CURRENT_TIMESTAMP - INTERVAL '12 days'),
    (4, 'Հարի Փոթերը և փիլիսոփայական քարը', 'Արամ Պետրոսյան', CURRENT_TIMESTAMP - INTERVAL '5 days', NULL),
    (5, 'Սպանություն Արևելյան ճեպընթացում', 'Նարե Հովհաննիսյան', CURRENT_TIMESTAMP - INTERVAL '18 days', CURRENT_TIMESTAMP - INTERVAL '9 days'),
    (6, 'Հարյուր տարվա մենություն', 'Գոռ Հակոբյան', CURRENT_TIMESTAMP - INTERVAL '26 days', CURRENT_TIMESTAMP - INTERVAL '15 days'),
    (7, 'Իմ անունը Արամ է', 'Լիլիթ Մանուկյան', CURRENT_TIMESTAMP - INTERVAL '6 days', NULL),
    (8, 'Սասունցի Դավիթ', 'Հայկ Հարությունյան', CURRENT_TIMESTAMP - INTERVAL '10 days', CURRENT_TIMESTAMP - INTERVAL '4 days'),
    (11, 'Անուշ', 'Սոնա Ավետիսյան', CURRENT_TIMESTAMP - INTERVAL '19 days', CURRENT_TIMESTAMP - INTERVAL '13 days'),
    (14, 'Խենթը', 'Տիգրան Սահակյան', CURRENT_TIMESTAMP - INTERVAL '8 days', NULL),
    (17, 'Պատերազմ և խաղաղություն', 'Էմմա Կարապետյան', CURRENT_TIMESTAMP - INTERVAL '15 days', CURRENT_TIMESTAMP - INTERVAL '7 days'),
    (23, 'Ֆարենհայթ 451', 'Արտյոմ Բաղդասարյան', CURRENT_TIMESTAMP - INTERVAL '30 days', CURRENT_TIMESTAMP - INTERVAL '18 days');
