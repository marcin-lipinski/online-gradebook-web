using System;
using Domain;

namespace Application.DTOs
{
    public class GradeDTO
    {
        public string StudentId { get; set; }
        public Guid Id { get; set; }
        public GradeType GradeType { get; set; }
        public GradeWeight GradeWeight { get; set; }
        public string Subject { get; set; }
        public string Description { get; set; }
        public string Teacher { get; set; }
    }
}