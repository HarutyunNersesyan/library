package am.demo.library.borrows;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/borrows")
public class BorrowController {
    private final BorrowService service;

    public BorrowController(BorrowService service) { this.service = service; }

    @GetMapping
    public List<BorrowDto> list() { return service.list(); }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BorrowDto borrow(@Valid @RequestBody BorrowBookRequest request) {
        return service.borrow(request);
    }

    @PostMapping("/{id}/return")
    public BorrowDto returnBook(@PathVariable Long id) {
        return service.returnBook(id);
    }
}
