using System;
using System.Collections.Generic;

namespace Application.PayU
{
    public class OrderDTO
    {
        public DateTime orderCreateDate {get; set;}
        public string TotalAmount {get;set;}
        public List<RetrieveRequest.Product> products {get;set;} = new List<RetrieveRequest.Product>();
        public string status { get;set;}
    }
}