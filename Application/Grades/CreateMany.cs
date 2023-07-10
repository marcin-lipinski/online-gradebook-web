using Domain;
using MediatR;
using Persistence;
using FluentValidation;
using Application.Core;
using System.Threading;
using System.Threading.Tasks;
using Application.DTOs;
using System;
using System.Collections.Generic;

namespace Application.Grades
{
    public class CreateMany
    {
        public class Command : IRequest<Result<Unit>>
        {
            public List<GradeDTO> Grades { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleForEach(x => x.Grades).SetValidator(new GradeValidator());
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
                var grades = new List<Grade>();
                request.Grades.ForEach(grade =>
                {
                    var newGrade = new Grade
                    {
                        Id = grade.Id,
                        Description = grade.Description,
                        GradeType = grade.GradeType,
                        GradeWeight = grade.GradeWeight,
                        Student = _context.Students.Find(grade.StudentId),
                        DivisionSubject = _context.DivisionSubjects.Find(Guid.Parse(grade.Subject))
                    };
                    grades.Add(newGrade);
                });

                await _context.Grades.AddRangeAsync(grades);
                var result = await _context.SaveChangesAsync() > 0;
                if (!result) return Result<Unit>.Failure("Failed to create grade");
                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}