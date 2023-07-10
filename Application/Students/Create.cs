using Domain;
using MediatR;
using Persistence;
using FluentValidation;
using Application.Core;
using System.Threading;
using System.Threading.Tasks;
using Application.DTOs;
using System.Linq;
using System;
using Application.EmailSender;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;

namespace Application.Students
{
    public class Create
    {
        public class Command : IRequest<Result<Unit>>
        {
            public StudentDTO Student { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Student).SetValidator(new StudentDTOValidator());
            }
        }
        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly UserManager<AppUser> _userManager;
            public Handler(DataContext context, UserManager<AppUser> userManager)
            {
                _context = context;
                _userManager = userManager;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var studentPassword = Seed.GenerateRandomString();
                string studentLogin;
                do
                {
                    studentLogin = Seed.GenerateRandomString();
                }while(_context.Users.Any(u => u.Login.Equals(studentLogin)));

                var appUser = new AppUser
                {
                    Id = request.Student.Id,
                    Name = request.Student.Name,
                    Surname = request.Student.Surname,
                    UserType = UserType.Student,
                    Login = studentLogin
                };

                await _userManager.CreateAsync(appUser, studentPassword);

                var division = request.Student.DivisionId == ""?
                    await _context.Divisions.FirstAsync(d => d.Name == "Unassigned")
                    : await _context.Divisions.FirstAsync(d => d.Id == Guid.Parse(request.Student.DivisionId));

                var student = new Student
                {
                    AppUser = appUser,
                    Division = division
                };
                _context.Students.Add(student);
                var result = await _context.SaveChangesAsync() > 0;
                if (!result) return Result<Unit>.Failure("Failed to create student");

                var emailReceiver = request.Student.Email;
                var email = new Email();
                await email.Send(
                    "Dane do logowania do systemu ePerkins", 
                    $"Dzień dobry {request.Student.Name},<br>oto twoje dane logujące do systemu ePerkins.<br><b>Login:</b> {studentLogin}<br><b>Hasło:</b> {studentPassword}<br><br>Proszę nie odpowiadać na tego maila.",
                    emailReceiver);                
                
                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}