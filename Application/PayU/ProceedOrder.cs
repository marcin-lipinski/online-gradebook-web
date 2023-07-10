using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.PayU
{
    public class ProceedOrder
    {
        public class Query : IRequest<Result<string>>
        {
            public PayUOrderDTO Order { get; set; }
            public string ParentId {get; set;}
        }

        public class CommandValidator : AbstractValidator<Query>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Order).SetValidator(new OrderValidator());
            }
        }
        public class Handler : IRequestHandler<Query, Result<string>>
        {
            private readonly DataContext _context;
            private readonly IMapper mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                _context = context;
                this.mapper = mapper;
            }

            public async Task<Result<string>> Handle(Query request, CancellationToken cancellationToken)
            {
                var payuorder = mapper.Map<PayUOrderDTO, PayUOrder>(request.Order);
                Console.WriteLine(payuorder.merchantPosId);
                try 
                {
                    var redirectResponse = await PayUClient.GetRedirectResponse(payuorder);
                    var order = new Order
                    {
                        Id = redirectResponse.orderId,
                        Parent = await _context.Parents.FindAsync(request.ParentId)
                    };
                    await _context.Orders.AddAsync(order);
                    var result = await _context.SaveChangesAsync() > 0;
                    if(!result) return Result<string>.Failure("https://eperkins.azurewebsites.net/somethingwentwrong");
                    return Result<string>.Success(redirectResponse.redirectUri);
                }catch (Exception)
                {
                    return Result<string>.Failure("https://eperkins.azurewebsites.net/somethingwentwrong");
                }
            }
        }
    }
}