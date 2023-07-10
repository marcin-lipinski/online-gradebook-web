using System.Security.Claims;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Infrastructure.Security
{
    public class UserTypeRequirement : IAuthorizationRequirement
    {
        public ICollection<UserType> userType;
    }

    public class UserTypeRequirementHandler : AuthorizationHandler<UserTypeRequirement>
    {
        private readonly DataContext dbContext;
        private readonly IHttpContextAccessor httpContextAcessor;

        public UserTypeRequirementHandler(DataContext dbContext, IHttpContextAccessor httpContextAcessor)
        {
            this.dbContext = dbContext;
            this.httpContextAcessor = httpContextAcessor;
        }

        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, UserTypeRequirement requirement)
        {
            var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);
            if(userId == null) return Task.CompletedTask;

            var user = dbContext.Users.AsNoTracking().SingleOrDefaultAsync(x => x.Id == userId).Result;
            if(user == null) return Task.CompletedTask;
            if(requirement.userType.Contains(user.UserType)) context.Succeed(requirement);

            return Task.CompletedTask;
        }
    }
}