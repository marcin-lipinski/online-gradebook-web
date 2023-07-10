using Microsoft.AspNetCore.Mvc;
using Application.Divisions;
using Domain;
using Microsoft.AspNetCore.Authorization;

namespace API.Controllers
{ 
    public class DivisionsController : BaseApiController
    { 
        [Authorize("IsAdminOrParent")]
        [HttpGet]
        public async Task<IActionResult> GetDivisions()
        {
            return HandleResult(await Mediator.Send(new List.Query()));
        }

        [Authorize("IsTeacher")]
        [HttpGet("byteacherid/{id}")]
        public async Task<IActionResult> GetDivisionsByTeacherId(string id)
        {
            return HandleResult(await Mediator.Send(new ListByTeacherId.Query { TeacherId = id }));
        }

        [Authorize("IsAdmin")]
        [HttpPost]
        public async Task<IActionResult> CreateDivision(NewDivisionDTO division)
        {
            return HandleResult(await Mediator.Send(new Create.Command { Division = division }));
        }

        [Authorize("IsAdmin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> EditDivision(Guid id, Division division)
        {
            return Ok(await Mediator.Send(new Edit.Command { Division = division }));
        }

        [Authorize("IsAdmin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDivision(Guid id)
        {
            return Ok(await Mediator.Send(new Delete.Command { Id = id }));
        }
    }
}