using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace Brokers.DTO
{
    public class RegisterDTO
    {
        [Required]
        public string Name { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [Phone]
        public string Phone { get; set; }

        [Required]
        [MinLength(6, ErrorMessage = "Password must be at least 6 characters long")]
        public string Password { get; set; }

        [Required]
        [RegularExpression("^(Admin|User|SuperAdmin)$", ErrorMessage = "Role must be either Admin, User, or SuperAdmin")]
        public string Role { get; set; }
    }
}
