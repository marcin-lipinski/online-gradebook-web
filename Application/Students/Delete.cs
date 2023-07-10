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

namespace Application.Students
{
    public class Delete
    {
        public class Command : IRequest<Result<Unit>>
        {
            public string Id { get; set; }
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
                var user = await _context.Users.FindAsync(request.Id);
                var student = _context.Students.Where(x => x.AppUserId == request.Id)
                                               .Include(x => x.AppUser)
                                               .Include(x => x.Grades)
                                               .Include(x => x.Parent).ThenInclude(p => p.AppUser)
                                               .First();
                if (student.Parent != null)
                {
                    _context.Remove(student.Parent.AppUser);
                    _context.Remove(student.Parent);                    
                }

                foreach (var grade in student.Grades) _context.Remove(grade);

                _context.Remove(student);
                _context.Remove(student.AppUser);

                var result = await _context.SaveChangesAsync() > 0;
                if (result) return Result<Unit>.Success(Unit.Value);
                return Result<Unit>.Failure("Failed to delete this student.");
            }
        }
    }
}