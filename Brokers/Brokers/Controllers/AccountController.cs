using Brokers.DTO;
using Microsoft.AspNetCore.Mvc;
using Brokers.models;
using Brokers.Service;
using Microsoft.AspNetCore.Identity;


namespace Brokers.Controllers
{
    public class AccountController : Controller
    {
        IUserService userService;

        public AccountController(IUserService userService)
        {
            this.userService = userService;
   
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] RegisterDTO newUser)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { success = false, message = ModelState });
            }
            User user = userService.AddUser(newUser);
            if (user == null)
            {
                return BadRequest(new { success = false, message = "User already exists" });
            }

            return Ok(new { success = true, message = "User registered successfully" });
        }
        [HttpGet("GetAllUsers")]
        public IActionResult GetAllUsers()
        {
            var users = userService.ViewAllUsers();
            if (users == null || !users.Any())
            {
                return NotFound(new { success = false, message = "No users found" });
            }

            return Ok(users);
        }
        [HttpPost("LogIn")]
        public IActionResult LogIn([FromBody] LoginDTO loginData)
        {
            
            var token = userService.Login(loginData);
            if (token == null )
            {
                return NotFound(new { success = false, message = "No users found" });
            }

            return Ok(new {success=true,message= "LogIn success",data=token});
        }
        [HttpDelete("delete/{id}")]
        public IActionResult DeleteUser(int id)
        {
            var user = userService.DeleteUser(id);
            if (user == false)
                return BadRequest(new {success=false,message="user not exist"});

          
            return Ok(new {success=true,message="user delted successfuly"});
        }

    }
}