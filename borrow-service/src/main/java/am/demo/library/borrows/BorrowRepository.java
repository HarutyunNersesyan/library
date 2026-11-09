package am.demo.library.borrows;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BorrowRepository extends JpaRepository<Borrowing, Long> {
    List<Borrowing> findAllByOrderByBorrowedAtDesc();
    boolean existsByBookIdAndReturnedAtIsNull(Long bookId);
}
