using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Domain
{
    public class Order
    {
        public string Id {get; set;}
        public string ParentId {get; set;}
        public Parent Parent {get;set;}
    }
}