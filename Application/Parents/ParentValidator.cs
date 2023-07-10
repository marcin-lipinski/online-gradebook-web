using FluentValidation;
using Domain;
using Application.DTOs;

namespace Application.Parents
{
    public class ParentValidator : AbstractValidator<Parent>
    {
        public ParentValidator()
        {
        }
    }

    public class ParentDTOValidator : AbstractValidator<ParentDTO>
    {
        public ParentDTOValidator()
        {
        }
    }
}