package am.demo.library.books;

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
class BookServiceTest {
    @Mock BookRepository repository;
    @InjectMocks BookService service;

    @Test
    void createTrimsInput() {
        when(repository.save(any(Book.class))).thenAnswer(invocation -> invocation.getArgument(0));
        BookDto result = service.create(new CreateBookRequest("  1984  ", "  Orwell  "));
        assertEquals("1984", result.title());
        assertEquals("Orwell", result.author());
    }

    @Test
    void unknownBookReturnsNotFound() {
        when(repository.findById(100L)).thenReturn(Optional.empty());
        assertThrows(ResponseStatusException.class, () -> service.get(100L));
    }
}
