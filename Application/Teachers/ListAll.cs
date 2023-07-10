using Domain;
using MediatR;
using Persistence;
using FluentValidation;
using Application.Core;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using AutoMapper.QueryableExtensions;
using Application.DTOs;
using AutoMapper;

namespace Application.Teachers
{
    public class ListAll
    {
        public class Query : IRequest<Result<List<TeacherDTO>>> { }
        public class Handler : IRequestHandler<Query, Result<List<TeacherDTO>>>
        {
            private readonly DataContext _context;
            public IMapper _mapper { get; }
            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }

            public async Task<Result<List<TeacherDTO>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var teacherList = await _context.Teachers.ProjectTo<TeacherDTO>(_mapper.ConfigurationProvider).ToListAsync();
                return Result<List<TeacherDTO>>.Success(teacherList);
            }
        }
    }
}