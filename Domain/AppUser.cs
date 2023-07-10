using Microsoft.AspNetCore.Identity;

namespace Domain
{
    public class AppUser : IdentityUser
    {
        public string Name { get; set; }
        public string Surname { get; set; }
        public string Login { get; set; }
        public UserType UserType { get; set; }
    }

    public enum UserType
    {
        Admin = 1,
        Teacher = 2,
        Parent = 3,
        Student = 4
    }
}