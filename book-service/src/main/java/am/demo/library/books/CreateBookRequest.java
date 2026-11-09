package am.demo.library.books;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateBookRequest(
    @NotBlank @Size(max = 150) String title,
    @NotBlank @Size(max = 100) String author
) {}
