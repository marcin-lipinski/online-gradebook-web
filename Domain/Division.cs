namespace Domain
{
    public class Division
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public Teacher SupervisingTeacher { get; set; }
        public string SupervisingTeacherId { get; set; }
        public ICollection<Student> Students { get; set; } = new List<Student>();
        public ICollection<DivisionSubject> DivisionSubjects { get; set; } = new List<DivisionSubject>();
    }
}