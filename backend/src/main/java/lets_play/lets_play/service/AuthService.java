package lets_play.lets_play.service;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import lets_play.lets_play.Mapper.UserMapper;
import lets_play.lets_play.config.JwtService;
import lets_play.lets_play.dto.*;
import lets_play.lets_play.model.User;
import lets_play.lets_play.repository.UserRepository;
import lets_play.lets_play.utls.ApiResponse;
import lombok.RequiredArgsConstructor;
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final UserMapper userMapper;

    public ApiResponse<UserResponse> register(RegisterRequest request) {
        if (request.name() == null || request.name().isBlank())
            return ApiResponse.error("Name is required",400);

        if (request.email() == null || request.email().isBlank())
            return ApiResponse.error("Email is required",400);

        if (request.password() == null || request.password().isBlank())
            return ApiResponse.error("Password is required",400);

        if (userRepository.existsByEmail(request.email()))
            return ApiResponse.error("Email already exists",400);

        User user = new User();
        user.setName(request.name());
        user.setEmail(request.email());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setRole("ROLE_USER");

        return ApiResponse.success("User registered successfully",
                userMapper.toResponse(userRepository.save(user)));
    }

    public ApiResponse<LoginResponse> login(LoginRequest request) {
        if (request.email() == null || request.email().isBlank())
            return ApiResponse.error("Email is required",400);

        if (request.password() == null || request.password().isBlank())
            return ApiResponse.error("Password is required",400);

        var userOpt = userRepository.findByEmail(request.email());
        if (userOpt.isEmpty())
            return ApiResponse.error("Invalid email or password",400);

        var user = userOpt.get();

        if (!passwordEncoder.matches(request.password(), user.getPassword()))
            return ApiResponse.error("Invalid email or password",400);

        String token = jwtService.generateToken(user);
        return ApiResponse.success("Login successful", new LoginResponse(token));
    }
}