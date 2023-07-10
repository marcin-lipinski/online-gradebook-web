using Application.Students;
using Application.Core;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using FluentValidation;
using FluentValidation.AspNetCore;
using Application.Interfaces;
using Infrastructure.Security;
using Microsoft.AspNetCore.Identity;
using Domain;

namespace API.Extensions
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config)
        {
            services.AddEndpointsApiExplorer();
            services.AddSwaggerGen();
            services.AddDbContext<DataContext>(options => options.UseSqlServer(config.GetConnectionString("GradebookDatebaseOnline")));
            services.AddCors(opt => opt.AddPolicy("CorsPolicy", policy => policy.WithOrigins("http://localhost:3000").AllowAnyMethod().AllowAnyHeader().AllowCredentials()));
            services.AddMediatR(typeof(Details.Handler));
            services.AddAutoMapper(typeof(MappingProfiles).Assembly);
            services.AddValidatorsFromAssemblyContaining<Create>();
            services.AddFluentValidationAutoValidation();
            services.AddHttpContextAccessor();
            services.AddScoped<IUserAccessor, UserAccessor>();

            return services;
        }
    }
}