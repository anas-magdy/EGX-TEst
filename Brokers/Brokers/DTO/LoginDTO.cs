﻿using System.ComponentModel.DataAnnotations;

namespace Brokers.DTO
{
    public class LoginDTO
    {
        [Required]
        [EmailAddress]
       public string Email { get; set; }

        [Required]
        [MinLength(6, ErrorMessage = "Password must be at least 6 characters long")]
        public string Password { get; set; }
    }
}
