package lets_play.lets_play.dto;

 
public record RegisterRequest (
     String name,
     String email,
     String password
){}
