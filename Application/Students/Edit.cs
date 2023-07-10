using Domain;
using MediatR;
using Persistence;
using FluentValidation;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Application.DTOs;
using System.Linq;
using System;

namespace Application.Students
{
    public class Edit
    {
        public class Command : IRequest
        {
            public StudentDTO Student { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Student).SetValidator(new StudentDTOValidator());
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
                var user = _context.Users.Find(request.Student.Id);
                user.Name = request.Student.Name;
                user.Surname = request.Student.Surname;

                var student = _context.Students.First(d => d.AppUserId == request.Student.Id);
                student.Division = _context.Divisions.First(d => d.Id == Guid.Parse(request.Student.DivisionId));


                await _context.SaveChangesAsync();
                Console.WriteLine(student.DivisionId);
                return Unit.Value;
            }
        }
    }
}