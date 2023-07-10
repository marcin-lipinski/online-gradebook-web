using Microsoft.AspNetCore.Mvc;
using Application.Grades;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Application.DTOs;

namespace API.Controllers
{
    public class GradesController : BaseApiController
    {
        [AllowAnonymous] 
        [HttpGet("bystudentid/{id}")]
        public async Task<IActionResult> GetStudentGradesByStudentId(string id)
        {
            return HandleResult(await Mediator.Send(new ListByStudent.Query { StudentId = id }));
        }

        [Authorize("IsTeacher")]
        [HttpGet("bydivisionsubjectid/{id}")]
        public async Task<IActionResult> GetGradesByDivisionSubjectId(Guid id)
        {
            return HandleResult(await Mediator.Send(new ListByDivisionSubjectId.Query { DivisionSubjectId = id }));
        }

        [Authorize("IsTeacher")]
        [HttpPost("one")] 
        public async Task<IActionResult> CreateGrade(GradeDTO grade)
        {
            return HandleResult(await Mediator.Send(new Create.Command { Grade = grade }));
        }

        [Authorize("IsTeacher")]
        [HttpPost("many")]
        public async Task<IActionResult> CreateManyGrades(List<GradeDTO> grades)
        {
            return HandleResult(await Mediator.Send(new CreateMany.Command { Grades = grades }));
        }

        [Authorize("IsTeacher")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteGrade(Guid id)
        {
            Console.WriteLine(id);
            return HandleResult(await Mediator.Send(new Delete.Command { Id = id }));
        }
    }
}