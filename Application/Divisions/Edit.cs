using MediatR;
using Persistence;
using System.Threading.Tasks;
using System.Threading;
using FluentValidation;
using AutoMapper;
using Domain;

namespace Application.Divisions
{
    public class Edit
    {
        public class Command : IRequest
        {
            public Division Division { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Division).SetValidator(new DivisionValidator());
            }
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
                var division = await _context.Divisions.FindAsync(request.Division.Id);
                _mapper.Map(request.Division, division);
                await _context.SaveChangesAsync();
                return Unit.Value;
            }
        }
    }
}