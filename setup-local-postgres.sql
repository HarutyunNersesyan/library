-- Optional alternative to Docker PostgreSQL, run in pgAdmin Query Tool while
-- connected as postgres to the default "postgres" database (not a transaction).
-- Run the two CREATE DATABASE statements SEPARATELY, one at a time.
-- Run each only once; if the database already exists, skip it.
CREATE DATABASE books_db;
CREATE DATABASE borrow_db;

-- Database login: postgres / admin (configured in both application.yml files).
-- For local postgres on port 5432 set DB_URL separately for each service:
-- Book:   jdbc:postgresql://localhost:5432/books_db
-- Borrow: jdbc:postgresql://localhost:5432/borrow_db
