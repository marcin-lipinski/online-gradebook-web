using Domain;
using MediatR;
using Persistence;
using FluentValidation;
using Application.Core;
using System.Threading;
using System.Threading.Tasks;
using System;

namespace Application.Subjects
{
    public class Delete
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Guid SubjectId { get; set; }
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
                var subject = await _context.Subjects.FindAsync(request.SubjectId);
                if (subject == null) return Result<Unit>.Failure("Failed to delete this subject.");
                _context.Remove(subject);

                var result = await _context.SaveChangesAsync() > 0;
                if (result) return Result<Unit>.Success(Unit.Value);
                return Result<Unit>.Failure("Failed to delete this subject.");

            }
        }
    }
}