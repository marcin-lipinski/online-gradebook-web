using Domain;
using MediatR;
using Persistence;
using FluentValidation;
using Application.Core;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;

namespace Application.Subjects
{
    public class ListByStudentId
    {
        public class Query : IRequest<Result<List<Subject>>>
        {
            public string StudentId { get; set; }
        }
        public class Handler : IRequestHandler<Query, Result<List<Subject>>>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Result<List<Subject>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var student = await _context.Students.FindAsync(request.StudentId);
                var divisionId = student.DivisionId;
                var subjectList = await _context.DivisionSubjects.Where(dsubject => dsubject.DivisionId == divisionId).Select(dsubject => dsubject.Subject).ToListAsync();

                return Result<List<Subject>>.Success(subjectList);
            }
        }
    }
}