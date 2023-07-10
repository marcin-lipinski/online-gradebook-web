using MediatR;
using Microsoft.EntityFrameworkCore;
using Application.Core;
using Persistence;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using System.Linq;
using AutoMapper.QueryableExtensions;
using AutoMapper;
using Application.DTOs;
using Domain;
using System;

namespace Application.Divisions
{
    public class ListByTeacherId
    {
        public class Query : IRequest<Result<List<DivisionSubjectDTO>>>
        {
            public string TeacherId { get; set; }
        }
        public class Handler : IRequestHandler<Query, Result<List<DivisionSubjectDTO>>>
        {
            private readonly DataContext _context;
            private readonly IMapper mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                _context = context;
                this.mapper = mapper;
            }

            public async Task<Result<List<DivisionSubjectDTO>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var divisionSubjects = await _context.DivisionSubjects.
                                            Where(ds => ds.TeacherId.Equals(request.TeacherId)).ProjectTo<DivisionSubjectDTO>(mapper.ConfigurationProvider)
                                            .ToListAsync();

                return Result<List<DivisionSubjectDTO>>.Success(divisionSubjects);
            }
        }
    }
}