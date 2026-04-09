package lets_play.lets_play.service;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import lets_play.lets_play.Mapper.UserMapper;
import lets_play.lets_play.dto.ChangePasswordRequest;
import lets_play.lets_play.dto.UpdateProfileRequest;
import lets_play.lets_play.dto.UserResponse;
import lets_play.lets_play.exception.AppException;
import lets_play.lets_play.repository.UserRepository;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    public UserResponse getProfile(String email) {
        var user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));
        return userMapper.toResponse(user);
    }

    public UserResponse updateProfile(String email, UpdateProfileRequest request) {
        var user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));

        if (request.name() != null && !request.name().isBlank())
            user.setName(request.name());

        if (request.email() != null && !request.email().isBlank()) {
            if (userRepository.existsByEmail(request.email()))
                throw new AppException("Email already taken", HttpStatus.CONFLICT);
            user.setEmail(request.email());
        }

        return userMapper.toResponse(userRepository.save(user));
    }

    public String deleteProfile(String email) {
        var user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));
        userRepository.deleteById(user.getId());
        return "Account deleted successfully";
    }

    public String changePassword(String email, ChangePasswordRequest request) {
        if (request.currentPassword() == null || request.currentPassword().isBlank())
            throw new AppException("Current password is required", HttpStatus.BAD_REQUEST);

        if (request.newPassword() == null || request.newPassword().isBlank())
            throw new AppException("New password is required", HttpStatus.BAD_REQUEST);

        var user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));

        if (!passwordEncoder.matches(request.currentPassword(), user.getPassword()))
            throw new AppException("Current password is incorrect", HttpStatus.UNAUTHORIZED);

        user.setPassword(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);
        return "Password updated successfully";
    }
}