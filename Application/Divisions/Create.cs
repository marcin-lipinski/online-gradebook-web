using Domain;
using MediatR;
using Persistence;
using FluentValidation;
using Application.Core;
using System.Threading.Tasks;
using System.Threading;
using System.Collections.Generic;
using System;

namespace Application.Divisions
{
    public class Create
    {
        public class Command : IRequest<Result<Unit>>
        {
            public NewDivisionDTO Division { get; set; }
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
                var division = new Division
                {
                    Id = Guid.Parse(request.Division.Id),
                    Name = request.Division.Name,
                    SupervisingTeacher = await _context.Teachers.FindAsync(request.Division.SupervisingTeacherId),
                    Students = new List<Student>()                 
                };

                var divisionSubjects = new List<DivisionSubject>();
                foreach(var dsDTO in request.Division.Subjects)
                {
                    divisionSubjects.Add(new DivisionSubject
                    {
                        Division = division,
                        Subject = await _context.Subjects.FindAsync(Guid.Parse(dsDTO.SubjectId)),
                        Teacher = await _context.Teachers.FindAsync(dsDTO.TeacherId),
                        Grades = new List<Grade>()
                    });
                }

                division.DivisionSubjects = divisionSubjects;

                await _context.DivisionSubjects.AddRangeAsync(divisionSubjects);
                await _context.Divisions.AddAsync(division);

                var result = await _context.SaveChangesAsync() > 0;
                if (!result) return Result<Unit>.Failure("Failed to create division");
                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}