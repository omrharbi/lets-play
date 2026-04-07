package lets_play.lets_play.dto;

public record AdminUpdateUserRequest(
    String name,
    String email,
    String role
) {}