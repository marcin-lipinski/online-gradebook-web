using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;

namespace Application.DTOs
{
    public class DivisionDTO
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public ICollection<Student> Students { get; set; } = new List<Student>();
    }
}