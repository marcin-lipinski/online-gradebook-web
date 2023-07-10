using System;
using Domain;

namespace Application.DTOs
{
    public class StudentDTO
    {
        public String Id { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public string DivisionId { get; set; }
        public string Email {get; set;}
    }
}