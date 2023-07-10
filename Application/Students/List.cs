using Domain;
using MediatR;
using Persistence;
using FluentValidation;
using Application.Core;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Application.DTOs;
using AutoMapper.QueryableExtensions;
using AutoMapper;

namespace Application.Students
{
    public class List
    {
        public class Query : IRequest<Result<List<StudentDTO>>> { }
        public class Handler : IRequestHandler<Query, Result<List<StudentDTO>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                _context = context;
                this._mapper = mapper;
            }
            public async Task<Result<List<StudentDTO>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var students = await _context.Students.ProjectTo<StudentDTO>(_mapper.ConfigurationProvider).ToListAsync();
                return Result<List<StudentDTO>>.Success(students);
            }
        }
    }
}