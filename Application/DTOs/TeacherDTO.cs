using System;
using Domain;

namespace Application.DTOs
{
    public class TeacherDTO
    {
        public String Id { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public string Email {get; set;}
    }
}