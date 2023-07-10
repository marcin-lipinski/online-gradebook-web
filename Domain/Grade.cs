namespace Domain
{
    public class Grade
    {
        public Guid Id { get; set; }
        public GradeType GradeType { get; set; }
        public GradeWeight GradeWeight { get; set; }
        public string StudentId { get; set; }
        public Student Student { get; set; }
        public Guid DivisionSubjectId { get; set; }
        public DivisionSubject DivisionSubject { get; set; }
        public string Description { get; set; }
    }

    public enum GradeType
    {
        S = 600, Sm = 575,
        Pp = 550, P = 500, Pm = 475,
        Cp = 450, C = 400, Cm = 375,
        Tp = 350, T = 300, Tm = 275,
        Dp = 250, D = 200, Dm = 175,
        Jp = 150, J = 100
    }

    public enum GradeWeight
    {
        S = 6,
        P = 5,
        C = 4,
        T = 3,
        D = 2,
        J = 1
    }
}