package lets_play.lets_play.dto;

public record  ProductRequest (
    String name,
    String description,
    Double price
) {
}
