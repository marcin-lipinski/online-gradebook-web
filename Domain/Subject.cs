namespace Domain
{
    public class Subject
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public ICollection<DivisionSubject> divisionSubjects { get; set; } = new List<DivisionSubject>();
    }
}