using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.PayU
{
    public class ListByParentId
    {
        public class Query : IRequest<Result<List<OrderDTO>>>
        {
            public string ParentId { get; set; }
        }
        public class Handler : IRequestHandler<Query, Result<List<OrderDTO>>>
        {
            private readonly DataContext _context;
            private readonly IMapper mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                _context = context;
                this.mapper = mapper;
            }

            public async Task<Result<List<OrderDTO>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var parentOrders = await _context.Orders.Where(x => x.ParentId == request.ParentId).ToListAsync();

                var ordersDTO = new List<OrderDTO>();
                foreach(var order in parentOrders) {
                    var orderDTO = mapper.Map<OrderDTO>(await PayUClient.OrderRetrieveRequest(order.Id));
                    if(orderDTO == null) Result<List<OrderDTO>>.Failure("Error while checking orders.");
                    ordersDTO.Add(orderDTO);
                }                             

                return Result<List<OrderDTO>>.Success(ordersDTO);
            }
        }
    }
}