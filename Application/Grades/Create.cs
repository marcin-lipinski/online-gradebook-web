using Domain;
using MediatR;
using Persistence;
using FluentValidation;
using Application.Core;
using System.Threading;
using System.Threading.Tasks;
using Application.DTOs;
using System;

namespace Application.Grades
{
    public class Create
    {
        public class Command : IRequest<Result<Unit>>
        {
            public GradeDTO Grade { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Grade).SetValidator(new GradeValidator());
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
                var newGrade = new Grade
                {
                    Id = request.Grade.Id,
                    Description = request.Grade.Description,
                    GradeType = request.Grade.GradeType,
                    GradeWeight = request.Grade.GradeWeight,
                    Student = _context.Students.Find(request.Grade.StudentId),
                    DivisionSubject = _context.DivisionSubjects.Find(Guid.Parse(request.Grade.Subject))
                };

                Console.WriteLine(newGrade);

                await _context.Grades.AddAsync(newGrade);
                var result = await _context.SaveChangesAsync() > 0;
                if (!result) return Result<Unit>.Failure("Failed to create grade");
                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}