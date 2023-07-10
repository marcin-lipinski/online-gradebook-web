using Microsoft.AspNetCore.Mvc;
using Application.Students;
using Microsoft.AspNetCore.Authorization;
using Application.DTOs;

namespace API.Controllers
{
    public class StudentsController : BaseApiController
    {
        [Authorize("IsAdmin")]
        [HttpGet]
        public async Task<IActionResult> GetStudents()
        {
            return HandleResult(await Mediator.Send(new List.Query()));
        }

        [Authorize("IsParent")]
        [HttpGet("details/{id}")]
        public async Task<IActionResult> GetStudent(String id)
        {
            return HandleResult(await Mediator.Send(new Details.Query { Id = id }));
        }

        [Authorize("IsAdmin")]
        [HttpGet("bydivisionid/{id}")]
        public async Task<IActionResult> GetStudentsByDivision(Guid id)
        {
            return HandleResult(await Mediator.Send(new ListByDivision.Query { DivisionId = id }));
        }

        [Authorize("IsAdmin")]
        [HttpPost]
        public async Task<IActionResult> CreateStudent(StudentDTO student)
        {
            return HandleResult(await Mediator.Send(new Create.Command { Student = student }));
        }

        [Authorize("IsAdmin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> EditStudent(string id, StudentDTO student)
        {
            return Ok(await Mediator.Send(new Edit.Command { Student = student }));
        }

        [Authorize("IsAdmin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStudent(string id)
        {
            return Ok(await Mediator.Send(new Delete.Command { Id = id }));
        }
    }
}