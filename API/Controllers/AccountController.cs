using API.DTOs;
using API.Servicies;
using Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Persistence;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<AppUser> userManager;
        private readonly TokenService tokenService;

        public AccountController(UserManager<AppUser> userManager, TokenService tokenService, DataContext dataContext, IMapper mapper)
        {
            this.userManager = userManager;
            this.tokenService = tokenService;
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<ActionResult<UserDTO>> Login(LoginDTO loginDto)
        {
            var appUser = await userManager.Users.SingleOrDefaultAsync(x => x.Login == loginDto.Login);
            if (appUser == null) return Unauthorized();

            var result = await userManager.CheckPasswordAsync(appUser, loginDto.Password);
            if (result)
            {
                return new UserDTO
                {
                    Id = appUser.Id,
                    Name = appUser.Name,
                    Surname = appUser.Surname,
                    Token = tokenService.CreateToken(appUser),
                    UserType = appUser.UserType
                };
            }

            return Unauthorized();
        }

        [HttpGet]
        public async Task<ActionResult<UserDTO>> GetCurrentUser()
        {
            var login = User.FindFirstValue("Login");
            var appUser = await userManager.Users.SingleOrDefaultAsync(x => x.Login == login);

            return new UserDTO
            {
                Id = appUser.Id,
                Name = appUser.Name,
                Surname = appUser.Surname,
                Token = tokenService.CreateToken(appUser),
                UserType = appUser.UserType
            };
        }
    }
}