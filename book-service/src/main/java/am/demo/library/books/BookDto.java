package am.demo.library.books;

public record BookDto(Long id, String title, String author) {
    public static BookDto from(Book book) {
        return new BookDto(book.getId(), book.getTitle(), book.getAuthor());
    }
}
