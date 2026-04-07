package lets_play.lets_play.dto;

public record UpdateProfileRequest(
    String name,
    String email
) {}