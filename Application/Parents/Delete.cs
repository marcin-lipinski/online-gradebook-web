using Domain;
using MediatR;
using Persistence;
using FluentValidation;
using Application.Core;
using System.Threading;
using System.Threading.Tasks;
using System;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace Application.Parents
{
    public class Delete
    {
        public class Command : IRequest
        {
            public string ParentId { get; set; }
        }
        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                Console.Out.WriteLine(request.ParentId);

                var package = _context.Parents.Where(x => x.AppUserId == request.ParentId).Include(x => x.AppUser).First();
                _context.Remove(package);

                var appUser = await _context.Users.FindAsync(package.AppUserId);
                _context.Remove(appUser);
                
                await _context.SaveChangesAsync();

                return Unit.Value;
            }
        }
    }
}