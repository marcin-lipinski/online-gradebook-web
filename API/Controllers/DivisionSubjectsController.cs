using Microsoft.AspNetCore.Mvc;
using Application.DivisionSubjects;
using Microsoft.AspNetCore.Authorization;

namespace API.Controllers
{
    public class DivisionSubjectsController : BaseApiController
    {
        [Authorize("IsAdmin")]
        [HttpGet("{id}")]
        public async Task<IActionResult> ListByDivisionId(Guid id)
        {
            return HandleResult(await Mediator.Send(new ListByDivisionId.Query { DivisionId = id }));
        }

        [Authorize("IsAdmin")]
        [HttpPost]
        public async Task<IActionResult> CreateDivisionSubject(DivisionSubjectsDTO division)
        {
            return HandleResult(await Mediator.Send(new Create.Command{Division = division}));
        }    

        [Authorize("IsAdmin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> EditDivisionSubject(Guid id, DivisionSubjectsDTO division)
        {
            return Ok(await Mediator.Send(new Edit.Command{DivisionSubjectsDTO = division}));
        }     

        [Authorize("IsAdmin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDivisionSubject(Guid id)
        {
            return Ok(await Mediator.Send(new Delete.Command{Id = id}));
        }   
    }
}