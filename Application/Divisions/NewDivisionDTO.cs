using System;
using System.Collections.Generic;

namespace Application.Divisions
{
    public class NewDivisionDTO
    {
        public string Id {get; set;}
        public string Name {get; set;}
        public string SupervisingTeacherId {get; set;}
        public ICollection<NewDSDTO> Subjects {get;set;}
    }

    public class NewDSDTO
    {
        public string SubjectId {get; set;}
        public string TeacherId {get;set;}
    }
}