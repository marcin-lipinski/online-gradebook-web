using MediatR;
using Persistence;
using System.Threading.Tasks;
using System.Threading;
using System;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Application.Core;

namespace Application.Divisions
{
    public class Delete
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Guid Id { get; set; }
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
                var division = await _context.Divisions.Where(d => d.Id == request.Id).Include(d => d.Students).Include(d => d.DivisionSubjects).FirstAsync();
                if(division == null) return Result<Unit>.Failure("Failed to delete this division");

                var unassignedDivision = await _context.Divisions.Where(d => d.Name == "Unassigned").FirstAsync();
                foreach(var subject in division.DivisionSubjects)
                {
                    _context.Remove(subject);
                }

                foreach(var student in division.Students)
                {
                    student.Division = unassignedDivision;
                }               

                _context.Remove(division);
                var result = await _context.SaveChangesAsync() > 0;
                
                if (!result) return Result<Unit>.Failure("Failed to delete this division");
                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}