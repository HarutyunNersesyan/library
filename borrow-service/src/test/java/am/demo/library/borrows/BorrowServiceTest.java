package am.demo.library.borrows;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BorrowServiceTest {
    @Mock BorrowRepository repository;
    @Mock BookCatalogClient bookClient;
    @InjectMocks BorrowService service;

    @Test
    void borrowChecksOtherMicroserviceAndSaves() {
        when(repository.existsByBookIdAndReturnedAtIsNull(1L)).thenReturn(false);
        when(bookClient.findBook(1L)).thenReturn(new BookCatalogClient.BookInfo(1L, "1984", "Orwell"));
        when(repository.saveAndFlush(any(Borrowing.class))).thenAnswer(inv -> inv.getArgument(0));

        BorrowDto result = service.borrow(new BorrowBookRequest(1L, "  Ani  "));
        assertEquals("1984", result.bookTitle());
        assertEquals("Ani", result.borrowerName());
        assertEquals("BORROWED", result.status());
        verify(bookClient).findBook(1L);
    }

    @Test
    void cannotBorrowAlreadyActiveBook() {
        when(repository.existsByBookIdAndReturnedAtIsNull(2L)).thenReturn(true);
        assertThrows(ResponseStatusException.class,
            () -> service.borrow(new BorrowBookRequest(2L, "Aram")));
        verifyNoInteractions(bookClient);
    }

    @Test
    void returnChangesStatus() {
        Borrowing borrowing = new Borrowing(1L, "1984", "Ani");
        when(repository.findById(5L)).thenReturn(Optional.of(borrowing));
        when(repository.save(borrowing)).thenReturn(borrowing);
        BorrowDto result = service.returnBook(5L);
        assertEquals("RETURNED", result.status());
        assertNotNull(result.returnedAt());
    }
}
