using Application.PayU;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class PayUController : BaseApiController
    {
        [AllowAnonymous]
        [HttpPost("{parentid}")]
        public async Task<IActionResult> Create(Guid parentid,  PayUOrderDTO order)
        {
            return HandleResult(await Mediator.Send(new ProceedOrder.Query { Order = order, ParentId = parentid.ToString()}));
        }

        [AllowAnonymous]
        [HttpGet("{parentid}")]
        public async Task<IActionResult> ListByParentID(Guid parentid)
        {
            return HandleResult(await Mediator.Send(new ListByParentId.Query { ParentId = parentid.ToString()}));
        }
    }
}