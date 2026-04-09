package lets_play.lets_play.Mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.springframework.stereotype.Component;

import lets_play.lets_play.dto.UserResponse;
import lets_play.lets_play.model.User;
@Mapper(componentModel = "spring")
public interface UserMapper {

    // maps User → lets_play.lets_play.dto.UserResponse automatically by field name
    UserResponse toResponse(User user);

    List<UserResponse> toResponseList(List<User> users);
}