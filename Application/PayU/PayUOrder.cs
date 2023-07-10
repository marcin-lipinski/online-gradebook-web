using System.Collections.Generic;

namespace Application.PayU
{
    public class PayUOrder
    {
        public readonly string continueUrl = "https://eperkins.azurewebsites.net/parent/notify";
        public string customerIp {get; set;}
        public readonly string merchantPosId = "--";
        public string description {get;set;}
        public readonly string currencyCode = "PLN";
        public string totalAmount {get;set;}
        public BuyerDTO buyer {get; set;}
        public IEnumerable<Product> products {get; set;}
    }

    public class Buyer
    {
        public string email {get;set;}
        public string phone {get;set;}
        public string firstName {get;set;}
        public string lastName {get;set;}
        public string language {get;} = "pl";
        
    }

    public class Product
    {
        public string name {get;set;}
        public string unitPrice {get;set;}
        public string quantity {get;set;}
    }
}