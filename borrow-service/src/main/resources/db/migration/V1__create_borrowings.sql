CREATE TABLE borrowings (
    id BIGSERIAL PRIMARY KEY,
    book_id BIGINT NOT NULL,
    book_title VARCHAR(150) NOT NULL,
    borrower_name VARCHAR(80) NOT NULL,
    borrowed_at TIMESTAMPTZ NOT NULL,
    returned_at TIMESTAMPTZ NULL
);

-- Exactly one active borrowing per book, even with concurrent requests.
CREATE UNIQUE INDEX uq_one_active_borrow_per_book
    ON borrowings (book_id)
    WHERE returned_at IS NULL;
