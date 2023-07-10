using Domain;
using MediatR;
using Persistence;
using FluentValidation;
using System.Threading;
using System.Threading.Tasks;
using Application.DTOs;
using AutoMapper;

namespace Application.Teachers
{
    public class Edit
    {
        public class Command : IRequest
        {
            public TeacherDTO Teacher { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Teacher).SetValidator(new TeacherDTOValidator());
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
                System.Console.WriteLine(request.Teacher.Id);
                var teacher = _context.Users.Find(request.Teacher.Id);
                teacher.Name = request.Teacher.Name;
                teacher.Surname = request.Teacher.Surname;
                await _context.SaveChangesAsync();
                return Unit.Value;
            }
        }
    }
}