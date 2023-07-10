using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Application.Core;
using Persistence;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using System;

namespace Application.Divisions
{
    public class List
    {
        public class Query : IRequest<Result<List<DivisionDTO>>> { }
        public class Handler : IRequestHandler<Query, Result<List<DivisionDTO>>>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Result<List<DivisionDTO>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var divisions = await _context.Divisions.Include(x => x.SupervisingTeacher).ThenInclude(x => x.AppUser).ToListAsync();
                var divisionsDTO = new List<DivisionDTO>();
                foreach(var div in divisions)
                {
                    divisionsDTO.Add(new DivisionDTO
                    {
                        Id = div.Id,
                        Name = div.Name,
                        SupervisingTeacherId = div.SupervisingTeacher == null? "" : div.SupervisingTeacher.AppUserId,
                        SupervisingTeacherName = div.SupervisingTeacher == null? "" : div.SupervisingTeacher.AppUser.Name + " " + div.SupervisingTeacher.AppUser.Surname
                    });
                }
                return Result<List<DivisionDTO>>.Success(divisionsDTO);
            }
        }
    }

    public class DivisionDTO
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string SupervisingTeacherName { get; set; }
        public string SupervisingTeacherId { get; set; }
    }
}