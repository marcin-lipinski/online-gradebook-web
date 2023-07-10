using Domain;

namespace Application.DTOs
{
    public class UserDTO
    {
        public AppUser AppUser { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public string Token { get; set; }
        public UserType UserType { get; set; }
    }
}