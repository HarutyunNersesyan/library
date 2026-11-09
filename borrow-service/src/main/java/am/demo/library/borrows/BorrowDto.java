package am.demo.library.borrows;

import java.time.Instant;

public record BorrowDto(
    Long id,
    Long bookId,
    String bookTitle,
    String borrowerName,
    Instant borrowedAt,
    Instant returnedAt,
    String status
) {
    public static BorrowDto from(Borrowing borrowing) {
        return new BorrowDto(
            borrowing.getId(),
            borrowing.getBookId(),
            borrowing.getBookTitle(),
            borrowing.getBorrowerName(),
            borrowing.getBorrowedAt(),
            borrowing.getReturnedAt(),
            borrowing.getReturnedAt() == null ? "BORROWED" : "RETURNED"
        );
    }
}
