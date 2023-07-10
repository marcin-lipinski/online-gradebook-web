using System.Collections.Generic;

namespace Application.PayU
{
    public class PayUOrderDTO
    {
        public string customerIp {get; set;}
        public string description {get;set;}
        public string totalAmount {get;set;}
        public BuyerDTO buyer {get; set;}
        public IEnumerable<Product> products {get; set;}
    }

    public class BuyerDTO
    {
        public string email {get;set;}
        public string phone {get;set;}
        public string firstName {get;set;}
        public string lastName {get;set;}
        public string language {get;} = "pl";
        
    }
}