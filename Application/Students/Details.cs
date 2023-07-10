using System;
using System.Threading;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Persistence;
using Application.Core;
using Application.DTOs;
using AutoMapper.QueryableExtensions;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace Application.Students
{
    public class Details
    {
        public class Query : IRequest<Result<StudentDTO>>
        {
            public String Id { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<StudentDTO>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                _context = context;
                this._mapper = mapper;
            }
            public async Task<Result<StudentDTO>> Handle(Query request, CancellationToken cancellationToken)
            {
                var student = await _context.Students.Include(s => s.Parent).Where(s => s.Parent.AppUserId == request.Id)
                                                     .ProjectTo<StudentDTO>(_mapper.ConfigurationProvider).FirstAsync();
                if(student == null) return null;
                Console.WriteLine(student.Name);
                return Result<StudentDTO>.Success(student);
            }
        }
    }
}