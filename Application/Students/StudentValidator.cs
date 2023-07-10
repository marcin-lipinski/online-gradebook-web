using FluentValidation;
using Domain;
using Application.DTOs;

namespace Application.Students
{
    public class StudentValidator : AbstractValidator<Student>
    {
        public StudentValidator()
        {
        }
    }

    public class StudentDTOValidator : AbstractValidator<StudentDTO>
    {
        public StudentDTOValidator()
        {
        }
    }
}