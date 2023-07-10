using MediatR;
using Persistence;
using System.Threading.Tasks;
using System.Threading;
using System;
using Application.Core;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace Application.DivisionSubjects
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
                var division = await _context.DivisionSubjects.Where(x => x.Id == request.Id).Include(x => x.Division).Include(x => x.Grades).Include(x => x.Subject).Include(x => x.Teacher).FirstAsync();
                _context.Remove(division);

                var result = await _context.SaveChangesAsync() > 0;
                if(result) return Result<Unit>.Success(Unit.Value);
                return Result<Unit>.Failure("Nie udało się usunąć tego przedmiotu z tej klasy.");
            }
        }
    }
}