package am.demo.library.borrows;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "borrowings")
public class Borrowing {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "book_id", nullable = false)
    private Long bookId;

    @Column(name = "book_title", nullable = false, length = 150)
    private String bookTitle;

    @Column(name = "borrower_name", nullable = false, length = 80)
    private String borrowerName;

    @Column(name = "borrowed_at", nullable = false)
    private Instant borrowedAt;

    @Column(name = "returned_at")
    private Instant returnedAt;

    protected Borrowing() {}

    public Borrowing(Long bookId, String bookTitle, String borrowerName) {
        this.bookId = bookId;
        this.bookTitle = bookTitle;
        this.borrowerName = borrowerName;
        this.borrowedAt = Instant.now();
    }

    public void markReturned() { this.returnedAt = Instant.now(); }
    public Long getId() { return id; }
    public Long getBookId() { return bookId; }
    public String getBookTitle() { return bookTitle; }
    public String getBorrowerName() { return borrowerName; }
    public Instant getBorrowedAt() { return borrowedAt; }
    public Instant getReturnedAt() { return returnedAt; }
}
