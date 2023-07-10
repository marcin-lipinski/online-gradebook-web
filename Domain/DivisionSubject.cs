namespace Domain
{
    public class DivisionSubject
    {
        public Guid Id { get; set; }
        public Guid DivisionId { get; set; }
        public Division Division { get; set; }
        public Guid SubjectId { get; set; }
        public Subject Subject { get; set; }
        public string TeacherId { get; set; }
        public Teacher Teacher { get; set; }
        public ICollection<Grade> Grades { get; set; } = new List<Grade>();
    }
}