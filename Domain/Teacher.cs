namespace Domain
{
    public class Teacher : BaseUser
    {
        public ICollection<Division> SupervisedDivisions { get; set; } = new List<Division>();
        public ICollection<DivisionSubject> DivisionSubjects { get; set; } = new List<DivisionSubject>();
    }
}