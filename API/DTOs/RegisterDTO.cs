using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class RegisterDTO
    {
        [Required]
        [EmailAddress]
        public string Login { get; set; }
        [Required]
        [RegularExpression("(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{10}$", ErrorMessage = "Password must be complex")]
        public string Password { get; set; }
    }
}