package am.demo.library.borrows;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record BorrowBookRequest(
    @NotNull @Positive Long bookId,
    @NotBlank @Size(max = 80) String borrowerName
) {}
