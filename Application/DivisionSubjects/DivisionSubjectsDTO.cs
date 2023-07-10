using System;

namespace Application.DivisionSubjects
{
    public class DivisionSubjectsDTO
    {
        public Guid Id {get; set;}
        public Guid DivisionId {get; set;}
        public string SubjectName {get; set;}
        public string SubjectId {get;set;}
        public string TeacherName {get; set;}
        public string TeacherId {get; set;}
    }
}