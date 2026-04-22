package lets_play.lets_play.service;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import lets_play.lets_play.Mapper.UserMapper;
import lets_play.lets_play.dto.ChangePasswordRequest;
import lets_play.lets_play.dto.UpdateProfileRequest;
import lets_play.lets_play.dto.UserResponse;
import lets_play.lets_play.repository.UserRepository;
import lets_play.lets_play.utls.ApiResponse;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    public ApiResponse<UserResponse> getProfile(String email) {
        var userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty())
            return ApiResponse.error("User not found",404);
        return ApiResponse.success(userMapper.toResponse(userOpt.get()));
    }

    public ApiResponse<UserResponse> updateProfile(String email, UpdateProfileRequest request) {
        var userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty())
            return ApiResponse.error("User not found",404);

        var user = userOpt.get();

        if (request.name() != null && !request.name().isBlank())
            user.setName(request.name());

        if (request.email() != null && !request.email().isBlank()) {
            if (userRepository.existsByEmail(request.email()))
                return ApiResponse.error("Email already taken",400);
            user.setEmail(request.email());
        }

        return ApiResponse.success("Profile updated",
                userMapper.toResponse(userRepository.save(user)));
    }

    public ApiResponse<String> deleteProfile(String email) {
        var userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty())
            return ApiResponse.error("User not found",404);
        userRepository.deleteById(userOpt.get().getId());
        return ApiResponse.success("Account deleted successfully");
    }

    public ApiResponse<String> changePassword(String email, ChangePasswordRequest request) {
        if (request.currentPassword() == null || request.currentPassword().isBlank())
            return ApiResponse.error("Current password is required",400);

        if (request.newPassword() == null || request.newPassword().isBlank())
            return ApiResponse.error("New password is required",400);

        var userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty())
            return ApiResponse.error("User not found",404);

        var user = userOpt.get();

        if (!passwordEncoder.matches(request.currentPassword(), user.getPassword()))
            return ApiResponse.error("Current password is incorrect",400);

        user.setPassword(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);
        return ApiResponse.success("Password updated successfully");
    }
}