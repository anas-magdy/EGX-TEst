using Brokers.DTO;
using Brokers.models;

namespace Brokers.Service
{
    public interface IUserService
    {
        User AddUser(RegisterDTO newUser);
        List<User> ViewAllUsers();
        //User GetUser(int id);

        string Login(LoginDTO loginData);

        bool DeleteUser(int id);
    }
}
