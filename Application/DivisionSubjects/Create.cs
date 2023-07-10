using Domain;
using MediatR;
using Persistence;
using FluentValidation;
using Application.Core;
using System.Threading.Tasks;
using System.Threading;
using System;
using System.Collections.Generic;

namespace Application.DivisionSubjects
{
    public class Create
    {
        public class Command : IRequest<Result<Unit>>
        {
            public DivisionSubjectsDTO Division { get; set; }
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
                var newDivisionSubject = new DivisionSubject
                {
                    Id = request.Division.Id,
                    Division = await _context.Divisions.FindAsync(request.Division.DivisionId),
                    Subject = await _context.Subjects.FindAsync(Guid.Parse(request.Division.SubjectId)),
                    Teacher = await _context.Teachers.FindAsync(request.Division.TeacherId),
                    Grades = new List<Grade>()

                };
                _context.DivisionSubjects.Add(newDivisionSubject);
                var result = await _context.SaveChangesAsync() > 0;
                if (!result) return Result<Unit>.Failure("Failed to create subject");
                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}