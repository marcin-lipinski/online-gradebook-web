using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.PayU.RedirectResponse
{
    public class RedirectResponse
    {
        public Status status {get;set;}
        public string redirectUri { get; set; }
        public string orderId { get; set; }
    }

    public class Status
    {
        public string statusCode {get;set;}
    }
}