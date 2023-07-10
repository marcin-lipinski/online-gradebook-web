using MediatR;
using Persistence;
using FluentValidation;
using Application.Core;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;
using System;
using System.Linq;
using AutoMapper;
using Application.DTOs;
using Microsoft.EntityFrameworkCore;

namespace Application.Grades
{
    public class ListByDivisionSubjectId
    {
        public class Query : IRequest<Result<Dictionary<string, List<GradeDTO>>>>
        {
            public Guid DivisionSubjectId { get; set; }
        }
        public class Handler : IRequestHandler<Query, Result<Dictionary<string, List<GradeDTO>>>>
        {
            private readonly DataContext _context;
            private readonly IMapper mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                _context = context;
                this.mapper = mapper;
            }

            public async Task<Result<Dictionary<string, List<GradeDTO>>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var grades = await _context.Grades.Where(x => x.DivisionSubjectId == request.DivisionSubjectId).Include(x => x.DivisionSubject).ThenInclude(t => t.Teacher).ThenInclude(t => t.AppUser).Include(x => x.DivisionSubject.Subject).ToListAsync();
                var gradeList = grades.GroupBy(g => g.StudentId)
                                      .ToDictionary(gr => gr.Key, gr => mapper.ProjectTo<GradeDTO>(gr.AsQueryable()).ToList());

                return Result<Dictionary<string, List<GradeDTO>>>.Success(gradeList);
            }
        }
    }
}