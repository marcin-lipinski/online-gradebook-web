using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentValidation;

namespace Application.PayU
{
    public class OrderValidator: AbstractValidator<PayUOrderDTO>
    {
        public OrderValidator()
        {
            RuleFor(x => x.customerIp).NotEmpty();
            RuleFor(x => x.description).NotEmpty();
            RuleFor(x => x.buyer).NotEmpty();
            RuleFor(x => x.products).NotEmpty();
            RuleFor(x => x.totalAmount).NotEmpty();
        }
    }
}