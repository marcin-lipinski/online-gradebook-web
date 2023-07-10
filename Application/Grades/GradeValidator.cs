using FluentValidation;
using Application.DTOs;

namespace Application.Grades
{
    public class GradeValidator : AbstractValidator<GradeDTO>
    {
        public GradeValidator()
        {
            RuleFor(x => x.Description).MinimumLength(15);
            RuleFor(x => x.GradeType).NotEmpty();
            RuleFor(x => x.GradeWeight).NotEmpty();
        }
    }
}