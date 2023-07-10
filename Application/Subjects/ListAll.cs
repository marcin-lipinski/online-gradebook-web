using Domain;
using MediatR;
using Persistence;
using FluentValidation;
using Application.Core;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace Application.Subjects
{
    public class ListAll
    {
        public class Query : IRequest<Result<List<Subject>>> { }
        public class Handler : IRequestHandler<Query, Result<List<Subject>>>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Result<List<Subject>>> Handle(Query request, CancellationToken cancellationToken)
            {
                return Result<List<Subject>>.Success(await _context.Subjects.ToListAsync());
            }
        }
    }
}