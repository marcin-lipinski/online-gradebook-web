using Microsoft.AspNetCore.Mvc;
using Application.Subjects;
using Microsoft.AspNetCore.Authorization;
using Application.DTOs;

namespace API.Controllers
{
    public class SubjectsController : BaseApiController
    {
        [Authorize("IsAdmin")] 
        [HttpGet("list")]
        public async Task<IActionResult> GetAllSubjects()
        {
            return HandleResult(await Mediator.Send(new ListAll.Query()));
        }

        [Authorize("IsParentOrStudent")]
        [HttpGet("bystudentid/{id}")]
        public async Task<IActionResult> GetStudentSubjectsByStudentId(string id)
        {
            return HandleResult(await Mediator.Send(new ListByStudentId.Query { StudentId = id }));
        }

        [Authorize("IsAdmin")]
        [HttpPost]
        public async Task<IActionResult> CreateSubject(SubjectDTO subject)
        {
            return HandleResult(await Mediator.Send(new Create.Command { Subject = subject }));
        }

        [Authorize("IsAdmin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> EditSubject(Guid id, SubjectDTO subject)
        {
            subject.Id = id;
            return HandleResult(await Mediator.Send(new Edit.Command { Subject = subject }));
        }

        [Authorize("IsAdmin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSubject(Guid id)
        {
            return HandleResult(await Mediator.Send(new Delete.Command { SubjectId = id }));
        }
    }
}