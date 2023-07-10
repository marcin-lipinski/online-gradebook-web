using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.PayU.RetrieveRequest
{
    public class Product
    {
        public string name { get; set; }
        public string unitPrice { get; set; }
        public string quantity { get; set; }
    }

    public class Order
    {
        public string orderId { get; set; }
        public string extOrderId { get; set; }
        public DateTime orderCreateDate { get; set; }
        public string notifyUrl { get; set; }
        public string customerIp { get; set; }
        public string merchantPosId { get; set; }
        public string description { get; set; }
        public string currencyCode { get; set; }
        public string totalAmount { get; set; }
        public string status { get; set; }
        public List<Product> products { get; set; }
    }

    public class Status
    {
        public string statusCode { get; set; }
        public string statusDesc { get; set; }
    }

    public class Property
    {
        public string name { get; set; }
        public string value { get; set; }
    }

    public class RetrieveRequest
    {
        public List<Order> orders { get; set; }
        public Status status { get; set; }
        public List<Property> properties { get; set; }
    }
}