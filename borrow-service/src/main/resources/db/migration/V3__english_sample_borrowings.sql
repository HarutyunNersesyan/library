-- Update the original demonstration entries only; real borrowing history is untouched.
UPDATE borrowings SET book_title = 'The Little Prince', borrower_name = 'Ani Sargsyan' WHERE book_id = 1 AND book_title = 'Փոքրիկ իշխանը' AND borrower_name = 'Անի Սարգսյան';
UPDATE borrowings SET book_title = '1984', borrower_name = 'Davit Mkrtchyan' WHERE book_id = 2 AND book_title = '1984' AND borrower_name = 'Դավիթ Մկրտչյան';
UPDATE borrowings SET book_title = 'The Alchemist', borrower_name = 'Mariam Grigoryan' WHERE book_id = 3 AND book_title = 'Ալքիմիկոսը' AND borrower_name = 'Մարիամ Գրիգորյան';
UPDATE borrowings SET book_title = 'Harry Potter and the Philosopher''s Stone', borrower_name = 'Aram Petrosyan' WHERE book_id = 4 AND book_title = 'Հարի Փոթերը և փիլիսոփայական քարը' AND borrower_name = 'Արամ Պետրոսյան';
UPDATE borrowings SET book_title = 'Murder on the Orient Express', borrower_name = 'Nare Hovhannisyan' WHERE book_id = 5 AND book_title = 'Սպանություն Արևելյան ճեպընթացում' AND borrower_name = 'Նարե Հովհաննիսյան';
UPDATE borrowings SET book_title = 'One Hundred Years of Solitude', borrower_name = 'Gor Hakobyan' WHERE book_id = 6 AND book_title = 'Հարյուր տարվա մենություն' AND borrower_name = 'Գոռ Հակոբյան';
UPDATE borrowings SET book_title = 'My Name Is Aram', borrower_name = 'Lilit Manukyan' WHERE book_id = 7 AND book_title = 'Իմ անունը Արամ է' AND borrower_name = 'Լիլիթ Մանուկյան';
UPDATE borrowings SET book_title = 'David of Sassoun', borrower_name = 'Hayk Harutyunyan' WHERE book_id = 8 AND book_title = 'Սասունցի Դավիթ' AND borrower_name = 'Հայկ Հարությունյան';
UPDATE borrowings SET book_title = 'Anush', borrower_name = 'Sona Avetisyan' WHERE book_id = 11 AND book_title = 'Անուշ' AND borrower_name = 'Սոնա Ավետիսյան';
UPDATE borrowings SET book_title = 'The Madman', borrower_name = 'Tigran Sahakyan' WHERE book_id = 14 AND book_title = 'Խենթը' AND borrower_name = 'Տիգրան Սահակյան';
UPDATE borrowings SET book_title = 'War and Peace', borrower_name = 'Emma Karapetyan' WHERE book_id = 17 AND book_title = 'Պատերազմ և խաղաղություն' AND borrower_name = 'Էմմա Կարապետյան';
UPDATE borrowings SET book_title = 'Fahrenheit 451', borrower_name = 'Artyom Baghdasaryan' WHERE book_id = 23 AND book_title = 'Ֆարենհայթ 451' AND borrower_name = 'Արտյոմ Բաղդասարյան';
