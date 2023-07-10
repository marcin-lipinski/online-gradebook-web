using Domain;
using MediatR;
using Persistence;
using FluentValidation;
using Application.Core;
using System.Threading;
using System.Threading.Tasks;
using Application.DTOs;
using Application.EmailSender;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using System.Linq;

namespace Application.Parents
{
    public class Create
    {
        public class Command : IRequest<Result<Unit>>
        {
            public ParentDTO Parent { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Parent).SetValidator(new ParentDTOValidator());
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
                var parentPassword = Seed.GenerateRandomString();
                string parentLogin;
                do
                {
                    parentLogin = Seed.GenerateRandomString();
                }while(_context.Users.Any(u => u.Login.Equals(parentLogin)));

                var appUser = new AppUser
                {
                    Id = request.Parent.Id,
                    Name = request.Parent.Name,
                    Surname = request.Parent.Surname,
                    UserType = UserType.Parent,
                    Login = parentLogin
                };
                await _userManager.CreateAsync(appUser, parentPassword);
                
                var parent = new Parent
                {
                    AppUser = appUser,
                    Student = request.Parent.StudentId == "" ? null : await _context.Students.FirstAsync(s => s.AppUserId == request.Parent.StudentId)
                };
                _context.Parents.Add(parent);
                var result = await _context.SaveChangesAsync() > 0;
                if (!result) return Result<Unit>.Failure("Failed to create parent");

                var emailReceiver = request.Parent.Email;
                var email = new Email();
                await email.Send(
                    "Dane do logowania do systemu ePerkins", 
                    $"Dzień dobry {request.Parent.Name},<br>oto twoje dane logujące do systemu ePerkins:<br><b>Login:</b> {parentLogin}<br><b>Hasło:</b> {parentPassword}<br><br>Proszę nie odpowiadać na tego maila.",
                    emailReceiver);
                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}