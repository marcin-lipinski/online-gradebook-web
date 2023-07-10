using MediatR;
using Persistence;
using System.Threading.Tasks;
using System.Threading;
using FluentValidation;
using AutoMapper;
using Domain;
using System;

namespace Application.DivisionSubjects
{
    public class Edit
    {
        public class Command : IRequest
        {
            public DivisionSubjectsDTO DivisionSubjectsDTO { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            public IMapper _mapper { get; }
            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }
            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var division = await _context.DivisionSubjects.FindAsync(request.DivisionSubjectsDTO.Id);
                division.Teacher = await _context.Teachers.FindAsync(request.DivisionSubjectsDTO.TeacherId);

                await _context.SaveChangesAsync();
                return Unit.Value;
            }
        }
    }
}