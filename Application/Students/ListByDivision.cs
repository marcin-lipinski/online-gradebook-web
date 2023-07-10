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
using Domain;
using AutoMapper.QueryableExtensions;

namespace Application.Students
{
    public class ListByDivision
    {
        public class Query : IRequest<Result<List<StudentDTO>>>
        {
            public Guid DivisionId { get; set; }
        }
        public class Handler : IRequestHandler<Query, Result<List<StudentDTO>>>
        {
            private readonly DataContext _context;
            private readonly IMapper mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                _context = context;
                this.mapper = mapper;
            }

            public async Task<Result<List<StudentDTO>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var students = await _context.Students.ProjectTo<StudentDTO>(mapper.ConfigurationProvider)
                        .Where(s => s.DivisionId == request.DivisionId.ToString())
                        .ToListAsync();
                return Result<List<StudentDTO>>.Success(students);
            }
        }
    }
}