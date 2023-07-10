using Microsoft.AspNetCore.Mvc;
using Application.Parents;
using Application.PayU;
using Microsoft.AspNetCore.Authorization;
using Application.DTOs;

namespace API.Controllers
{
    public class ParentsController : BaseApiController
    {
        [Authorize("IsAdminOrParent")]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return HandleResult(await Mediator.Send(new List.Query()));
        }

        [Authorize("IsAdmin")]
        [HttpPost]
        public async Task<IActionResult> CreateParent(ParentDTO parent)
        {
            return HandleResult(await Mediator.Send(new Create.Command { Parent = parent }));
        }

        [Authorize("IsAdmin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> EditParent(string id, ParentDTO parent)
        {
            return Ok(await Mediator.Send(new Edit.Command { Parent = parent }));
        }

        [Authorize("IsAdmin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteParent(string id)
        {
            return Ok(await Mediator.Send(new Delete.Command { ParentId = id }));
        }
    }
}