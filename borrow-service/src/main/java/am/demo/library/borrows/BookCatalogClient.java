package am.demo.library.borrows;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClient;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.server.ResponseStatusException;

@Component
public class BookCatalogClient {
    private final RestClient client;

    public BookCatalogClient(@Value("${book-service.url:http://localhost:8081}") String baseUrl) {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(2_000);
        factory.setReadTimeout(2_000);
        this.client = RestClient.builder().baseUrl(baseUrl).requestFactory(factory).build();
    }

    public BookInfo findBook(Long bookId) {
        try {
            BookInfo book = client.get().uri("/api/books/{id}", bookId)
                .retrieve().body(BookInfo.class);
            if (book == null) throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Empty book response");
            return book;
        } catch (HttpClientErrorException.NotFound e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The selected book does not exist");
        } catch (ResourceAccessException e) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "Book Service is unreachable");
        }
    }

    public record BookInfo(Long id, String title, String author) {}
}
