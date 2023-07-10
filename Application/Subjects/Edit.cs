using Domain;
using MediatR;
using Persistence;
using FluentValidation;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Application.DTOs;
using System;
using Application.Core;

namespace Application.Subjects
{
    public class Edit
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
            public IMapper _mapper { get; }
            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var subject = await _context.Subjects.FindAsync(request.Subject.Id);
                _mapper.Map(request.Subject, subject);                                    //map requestActivity properties to databaseActivity - updates them
                var result = await _context.SaveChangesAsync() > 0;
                if (!result) return Result<Unit>.Failure("Failed to update activity");
                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}