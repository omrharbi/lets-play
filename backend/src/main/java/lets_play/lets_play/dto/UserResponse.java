package lets_play.lets_play.dto;

public record UserResponse(
    String id,
    String name,
    String email,
    String role
) {}
