package lets_play.lets_play.dto;

public record ChangePasswordRequest(
    String currentPassword,
    String newPassword
) {}