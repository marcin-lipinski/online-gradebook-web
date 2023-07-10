namespace Domain
{
    public class Student : BaseUser
    {
        public DateTime Birthdate { get; set; }
        public Guid DivisionId { get; set; }
        public Division Division { get; set; }
        public Parent Parent { get; set; }
        public ICollection<Grade> Grades { get; set; } = new List<Grade>();
    }
}