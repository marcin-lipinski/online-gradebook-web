using Domain;
using MediatR;
using Persistence;
using FluentValidation;
using Application.Core;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using AutoMapper.QueryableExtensions;
using Application.DTOs;
using AutoMapper;

namespace Application.Grades
{
    public class ListByStudent
    {
        public class Query : IRequest<Result<List<GradeDTO>>>
        {
            public string StudentId { get; set; }
        }
        public class Handler : IRequestHandler<Query, Result<List<GradeDTO>>>
        {
            private readonly DataContext _context;
            private readonly IMapper mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                _context = context;
                this.mapper = mapper;
            }

            public async Task<Result<List<GradeDTO>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var gradeList = await _context.Grades.Where(grade => grade.StudentId.Equals(request.StudentId)).ProjectTo<GradeDTO>(mapper.ConfigurationProvider).ToListAsync();
                return Result<List<GradeDTO>>.Success(gradeList);
            }
        }
    }
}