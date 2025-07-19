using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Brokers.DTO;
using Brokers.models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace Brokers.Service.cs
{
    public class UserService: IUserService
    {
        private MyDbContext Db;
        private readonly PasswordHasher<User> _passwordHasher;
        private readonly IConfiguration configuration;
        public UserService(MyDbContext _myDbContext, PasswordHasher<User> hasher, IConfiguration configuration)
        {
            this.Db = _myDbContext;
            this.configuration = configuration;
            this._passwordHasher = hasher;
        }

        public User AddUser(RegisterDTO newUser)
        {
            var exists = Db.Users.Any(u => u.Email == newUser.Email );
            if (exists)
            {
                return null;
            }
            var user = new User
            {
                Name = newUser.Name,
                Email = newUser.Email,
                Phone = newUser.Phone,
                Role = newUser.Role
            };
            user.Password = _passwordHasher.HashPassword(user, newUser.Password);

            Db.Users.Add(user);
            Db.SaveChanges();

            return user;
        }
        public List<User> ViewAllUsers()
        {

            return Db.Users.ToList();
        }
        public string Login(LoginDTO loginData)
        {
            var user = Db.Users.First(m => m.Email == loginData.Email);
            Console.WriteLine(user);
            if (user == null)
            {
                return null;
            }
            var result = _passwordHasher.VerifyHashedPassword(user, user.Password, loginData.Password);

            if (result == PasswordVerificationResult.Failed)
            {
                return null;
            }
            return CreateToken(user);
        }
        private string CreateToken(User u)
        {
            //1. claims (optional/ mandatory if role based authorization enabled)
            List<Claim> _claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, u.Id.ToString()),
                new Claim(ClaimTypes.Email, u.Email),
                new Claim(ClaimTypes.Role, u.Role),
            };
            var key = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(configuration.GetValue<string>("Jwt:Key")!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var tokenDescriptor = new JwtSecurityToken(
                claims: _claims,
                expires: DateTime.Now.AddDays(20),
                signingCredentials: creds
                );
            return new JwtSecurityTokenHandler().WriteToken(tokenDescriptor);
        }
        public bool DeleteUser(int id)
        {
            var broker = Db.Brokers.Find(id);
            if (broker == null)
                return false;

            Db.Brokers.Remove(broker);
            Db.SaveChanges();
            return true;
        }

    }
}
