using Domain;
using MediatR;
using Persistence;
using FluentValidation;
using Application.Core;
using System.Threading;
using System.Threading.Tasks;
using System;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace Application.Teachers
{
    public class Delete
    {
        public class Command : IRequest<Result<Unit>>
        {
            public string TeacherId { get; set; }
        }
        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.FindAsync(request.TeacherId);
                var package = _context.Teachers.Where(x => x.AppUserId == request.TeacherId).Include(x => x.AppUser)
                                               .Include(x => x.DivisionSubjects).Include(x => x.SupervisedDivisions).First();

                _context.Remove(package);

                var appUser = await _context.Users.FindAsync(package.AppUserId);
                _context.Remove(appUser);

                var result = await _context.SaveChangesAsync() > 0;
                if (!result) return Result<Unit>.Failure("Failed to delete this division");
                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}