package lets_play.lets_play.Mapper;

import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import lets_play.lets_play.dto.UserResponse;
import lets_play.lets_play.model.User;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-04-22T21:00:04+0100",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.45.0.v20260224-0835, environment: Java 21.0.10 (Eclipse Adoptium)"
)
@Component
public class UserMapperImpl implements UserMapper {

    @Override
    public UserResponse toResponse(User user) {
        if ( user == null ) {
            return null;
        }

        String id = null;
        String name = null;
        String email = null;
        String role = null;

        id = user.getId();
        name = user.getName();
        email = user.getEmail();
        role = user.getRole();

        UserResponse userResponse = new UserResponse( id, name, email, role );

        return userResponse;
    }

    @Override
    public List<UserResponse> toResponseList(List<User> users) {
        if ( users == null ) {
            return null;
        }

        List<UserResponse> list = new ArrayList<UserResponse>( users.size() );
        for ( User user : users ) {
            list.add( toResponse( user ) );
        }

        return list;
    }
}
