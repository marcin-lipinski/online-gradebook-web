using System;
using System.Collections.Generic;
using Domain;

namespace Application.DTOs
{
    public class DivisionSubjectDTO
    {
        public Guid Id { get; set; }
        public ICollection<StudentDTO> StudentList { get; set; }
        public string DivisionName { get; set; }
        public string SubjectName { get; set; }
    }
}