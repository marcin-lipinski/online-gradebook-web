namespace Domain
{
    public class Parent : BaseUser
    {
        public string StudentId { get; set; }
        public Student Student { get; set; }
        public List<Order> Orders {get; set;} = new List<Order>();
    }
}