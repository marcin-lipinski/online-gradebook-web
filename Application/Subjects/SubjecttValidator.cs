using FluentValidation;
using Domain;
using Application.DTOs;

namespace Application.Subjects
{
    public class SubjectValidator : AbstractValidator<SubjectDTO>
    {
        public SubjectValidator()
        {
        }
    }
}