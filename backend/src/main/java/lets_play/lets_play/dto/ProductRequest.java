package lets_play.lets_play.dto;

import jakarta.validation.constraints.*;

public record ProductRequest(
    @NotBlank(message = "Name is required")
    String name,

    String description,

    @NotNull(message = "Price is required")
    @Positive(message = "Price must be greater than 0")
    Double price
) {}