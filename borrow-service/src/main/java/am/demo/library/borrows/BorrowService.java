package am.demo.library.borrows;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class BorrowService {
    private final BorrowRepository repository;
    private final BookCatalogClient bookClient;

    public BorrowService(BorrowRepository repository, BookCatalogClient bookClient) {
        this.repository = repository;
        this.bookClient = bookClient;
    }

    @Transactional(readOnly = true)
    public List<BorrowDto> list() {
        return repository.findAllByOrderByBorrowedAtDesc().stream().map(BorrowDto::from).toList();
    }

    @Transactional
    public BorrowDto borrow(BorrowBookRequest request) {
        if (repository.existsByBookIdAndReturnedAtIsNull(request.bookId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "This book is already borrowed");
        }

        BookCatalogClient.BookInfo book = bookClient.findBook(request.bookId());
        Borrowing borrowing = new Borrowing(book.id(), book.title(), request.borrowerName().trim());
        try {
            // A PostgreSQL partial unique index also protects against concurrent borrowers.
            return BorrowDto.from(repository.saveAndFlush(borrowing));
        } catch (DataIntegrityViolationException e) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "This book is already borrowed");
        }
    }

    @Transactional
    public BorrowDto returnBook(Long id) {
        Borrowing borrowing = repository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Borrowing not found"));
        if (borrowing.getReturnedAt() != null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Book was already returned");
        }
        borrowing.markReturned();
        return BorrowDto.from(repository.save(borrowing));
    }
}
