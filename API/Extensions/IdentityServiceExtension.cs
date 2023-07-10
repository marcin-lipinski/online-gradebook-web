using System.Text;
using API.Servicies;
using Domain;
using Infrastructure.Security;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using Persistence;

namespace API.Extensions
{
    public static class IdentityServiceExtension
    {
        public static IServiceCollection AddIdentityServices(this IServiceCollection services, IConfiguration config)
        {
            services.AddIdentityCore<AppUser>(opt =>
            {
                opt.Password.RequireNonAlphanumeric = false;
                opt.User.RequireUniqueEmail = true;
            })
            .AddEntityFrameworkStores<DataContext>();

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["TokenKey"]));

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(opt =>
                {
                    opt.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = key,
                        ValidateIssuer = false,
                        ValidateAudience = false
                    };
                });
            services.AddAuthorization(opt =>
            {
                opt.AddPolicy("IsAdmin", policy => policy.Requirements.Add(new UserTypeRequirement { userType = new List<UserType> { UserType.Admin } }));
                opt.AddPolicy("IsAdminOrParent", policy => policy.Requirements.Add(new UserTypeRequirement { userType = new List<UserType> { UserType.Admin, UserType.Parent } }));
                opt.AddPolicy("IsTeacher", policy => policy.Requirements.Add(new UserTypeRequirement { userType = new List<UserType> { UserType.Teacher } }));
                opt.AddPolicy("IsAdminOrTeacher", policy => policy.Requirements.Add(new UserTypeRequirement { userType = new List<UserType> { UserType.Admin, UserType.Teacher } }));
                opt.AddPolicy("IsParent", policy => policy.Requirements.Add(new UserTypeRequirement { userType = new List<UserType> { UserType.Parent } }));
                opt.AddPolicy("IsStudent", policy => policy.Requirements.Add(new UserTypeRequirement { userType = new List<UserType> { UserType.Student } }));
                opt.AddPolicy("IsParentOrStudent", policy => policy.Requirements.Add(new UserTypeRequirement { userType = new List<UserType> { UserType.Parent, UserType.Student } }));
            });
            services.AddTransient<IAuthorizationHandler, UserTypeRequirementHandler>();
            services.AddScoped<TokenService>();

            return services;
        }
    }
}