using Domain;
using MediatR;
using Persistence;
using FluentValidation;
using Application.Core;
using System.Threading;
using System.Threading.Tasks;
using System;
using Application.DTOs;

namespace Application.Subjects
{
    public class Create
    {
        public class Command : IRequest<Result<Unit>>
        {
            public SubjectDTO Subject { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Subject).SetValidator(new SubjectValidator());
            }
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
                Console.WriteLine(request.Subject);
                var subject = new Subject
                {
                    Id = request.Subject.Id,
                    Name = request.Subject.Name
                };
                await _context.Subjects.AddAsync(subject);
                var result = await _context.SaveChangesAsync() > 0;
                if (!result) return Result<Unit>.Failure("Failed to create subject");
                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}