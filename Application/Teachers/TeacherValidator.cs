using FluentValidation;
using Domain;
using Application.DTOs;

namespace Application.Teachers
{
    public class TeacherValidator : AbstractValidator<Teacher>
    {
        public TeacherValidator()
        {
        }
    }

    public class TeacherDTOValidator : AbstractValidator<TeacherDTO>
    {
        public TeacherDTOValidator()
        {
            RuleFor(x => x.Name).MinimumLength(2);
            RuleFor(x => x.Surname).MinimumLength(2);
            RuleFor(x => x.Id).Length(36);
        }
    }
}