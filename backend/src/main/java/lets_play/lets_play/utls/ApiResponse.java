package lets_play.lets_play.utls;
public record ApiResponse<T>(
    boolean success,
    String message,
    T data,
    int status
) {
    public static <T> ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>(true, message, data, 200);
    }

    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(true, "Success", data, 200);
    }

    public static ApiResponse<String> success(String message) {
        return new ApiResponse<>(true, message, null, 200);
    }

    public static <T> ApiResponse<T> created(String message, T data) {
        return new ApiResponse<>(true, message, data, 201);
    }

    public static <T> ApiResponse<T> error(String message, int status) {
        return new ApiResponse<>(false, message, null, status);
    }
}