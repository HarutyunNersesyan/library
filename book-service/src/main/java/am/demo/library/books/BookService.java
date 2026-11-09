package am.demo.library.books;

import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class BookService {
    private final BookRepository repository;

    public BookService(BookRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<BookDto> list() {
        return repository.findAll(Sort.by("id").ascending()).stream().map(BookDto::from).toList();
    }

    @Transactional(readOnly = true)
    public BookDto get(Long id) {
        return BookDto.from(repository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Book not found")));
    }

    @Transactional
    public BookDto create(CreateBookRequest request) {
        Book saved = repository.save(new Book(request.title().trim(), request.author().trim()));
        return BookDto.from(saved);
    }

    @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Book not found");
        }
        repository.deleteById(id);
    }
}
