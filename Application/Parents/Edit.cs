using Domain;
using MediatR;
using Persistence;
using FluentValidation;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Application.DTOs;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace Application.Parents
{
    public class Edit
    {
        public class Command : IRequest
        {
            public ParentDTO Parent { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Parent).SetValidator(new ParentDTOValidator());
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
                var user = _context.Users.Find(request.Parent.Id);
                user.Name = request.Parent.Name;
                user.Surname = request.Parent.Surname;

                var parent = _context.Parents.First(p => p.AppUserId == request.Parent.Id);
                if (request.Parent.StudentId == "")
                {
                    parent.Student = null;
                }
                else
                {
                    parent.Student = _context.Students.First(s => s.AppUserId == request.Parent.StudentId);
                }

                await _context.SaveChangesAsync();
                return Unit.Value;
            }
        }
    }
}