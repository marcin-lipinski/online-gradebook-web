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
using AutoMapper;
using AutoMapper.QueryableExtensions;

namespace Application.DivisionSubjects
{
    public class ListByDivisionId
    {
        public class Query : IRequest<Result<List<DivisionSubjectsDTO>>>
        {
            public Guid DivisionId { get; set; }
        }
        public class Handler : IRequestHandler<Query, Result<List<DivisionSubjectsDTO>>>
        {
            private readonly DataContext _context;
            private readonly IMapper mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                _context = context;
                this.mapper = mapper;
            }

            public async Task<Result<List<DivisionSubjectsDTO>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var divisions = await _context.DivisionSubjects.Where(x => x.DivisionId == request.DivisionId)
                                            .Include(x => x.Teacher)
                                            .ThenInclude(t => t.AppUser)
                                            .ProjectTo<DivisionSubjectsDTO>(mapper.ConfigurationProvider)
                                            .ToListAsync();

                return Result<List<DivisionSubjectsDTO>>.Success(divisions);
            }
        }
    }
}