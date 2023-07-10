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
using AutoMapper;
using AutoMapper.QueryableExtensions;

namespace Application.Parents
{
    public class List
    {
        public class Query : IRequest<Result<List<ParentDTO>>> { }
        public class Handler : IRequestHandler<Query, Result<List<ParentDTO>>>
        {
            private readonly DataContext _context;
            public IMapper _mapper { get; }
            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }

            public async Task<Result<List<ParentDTO>>> Handle(Query request, CancellationToken cancellationToken)
            {
                return Result<List<ParentDTO>>.Success(await _context.Parents.ProjectTo<ParentDTO>(_mapper.ConfigurationProvider).ToListAsync());
            }
        }
    }
}