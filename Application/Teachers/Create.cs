using Domain;
using MediatR;
using Persistence;
using FluentValidation;
using Application.Core;
using System.Threading;
using System.Threading.Tasks;
using Application.DTOs;
using Microsoft.AspNetCore.Identity;
using Application.EmailSender;
using System.Linq;

namespace Application.Teachers
{
    public class Create
    {
        public class Command : IRequest<Result<Unit>>
        {
            public TeacherDTO Teacher { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Teacher).SetValidator(new TeacherDTOValidator());
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
                var teacherPassword = Seed.GenerateRandomString();
                string teacherLogin;
                do
                {
                    teacherLogin = Seed.GenerateRandomString();
                }while(_context.Users.Any(u => u.Login.Equals(teacherLogin)));

                var appUser = new AppUser
                {
                    Id = request.Teacher.Id,
                    Name = request.Teacher.Name,
                    Surname = request.Teacher.Surname,
                    UserType = UserType.Teacher,
                    Login = teacherLogin
                };

                await _userManager.CreateAsync(appUser, teacherPassword);

                var teacher = new Teacher
                {
                    AppUser = appUser
                };
                _context.Teachers.Add(teacher);
                var result = await _context.SaveChangesAsync() > 0;
                if (!result) return Result<Unit>.Failure("Failed to create teacher");

                var emailReceiver = request.Teacher.Email;
                var email = new Email();
                await email.Send(
                    "Dane do logowania do systemu ePerkins", 
                    $"Dzień dobry {request.Teacher.Name},<br>oto twoje dane logujące do systemu ePerkins:<br><b>Login:</b> {teacherLogin}<br><b>Hasło:</b> {teacherPassword}<br><br>Proszę nie odpowiadać na tego maila.",
                    emailReceiver); 

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}