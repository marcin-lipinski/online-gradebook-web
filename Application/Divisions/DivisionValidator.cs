using FluentValidation;
using Domain;

namespace Application.Divisions
{
    public class DivisionValidator : AbstractValidator<Division>
    {
        public DivisionValidator()
        {
            RuleFor(x => x.Name).NotEmpty();
        }
    }
}