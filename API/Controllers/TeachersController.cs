using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Application.Teachers;
using Application.DTOs;

namespace API.Controllers
{
    public class TeachersController : BaseApiController
    {
        [Authorize("IsAdmin")] 
        [HttpGet("list")]
        public async Task<IActionResult> GetAllTeachers()
        {
            return HandleResult(await Mediator.Send(new ListAll.Query()));
        }

        [Authorize("IsAdmin")]
        [HttpPost]
        public async Task<IActionResult> CreateTeacher(TeacherDTO teacher)
        {
            return HandleResult(await Mediator.Send(new Create.Command { Teacher = teacher }));
        }

        [Authorize("IsAdmin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> EditTeacher(string id, TeacherDTO teacher)
        {
            return Ok(await Mediator.Send(new Edit.Command { Teacher = teacher }));
        }

        [Authorize("IsAdmin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTeacher(string id)
        {
            return Ok(await Mediator.Send(new Delete.Command { TeacherId = id }));
        }
    }
}