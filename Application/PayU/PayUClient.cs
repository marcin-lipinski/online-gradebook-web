using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Net;
using System.IO;

namespace Application.PayU
{
    public static class PayUClient
    {
        private static readonly string AccessTokenUrl = "--";
        private static readonly string PayUId = "--";
        private static readonly string PayUSecret = "--";
        private static async Task<string> GetAccessTokenAsync()
        {
            using(var HttpClient = new HttpClient(new HttpClientHandler { AllowAutoRedirect = false }))
            {                
                var requestData = "grant_type=client_credentials&client_id=" + PayUId + "&client_secret=" + PayUSecret;
                var content = new StringContent(requestData, Encoding.UTF8, "application/x-www-form-urlencoded");

                var response = await HttpClient.PostAsync(AccessTokenUrl, content);//f1888289-9629-4374-ad3e-6e00b1cacd96
                var responseContent = await response.Content.ReadAsStringAsync();

                var tokenResponse = JsonSerializer.Deserialize<TokenResponse.TokenResponse>(responseContent);
                return tokenResponse.access_token;
            }
        }

        public static async Task<RedirectResponse.RedirectResponse> GetRedirectResponse(PayUOrder order)
        {
            using(var HttpClient = new HttpClient(new HttpClientHandler { AllowAutoRedirect = false }))
            {
                var token = await GetAccessTokenAsync();
                var requestContent = new
                {
                    continueUrl = order.continueUrl,
                    customerIp = order.customerIp,
                    merchantPosId = order.merchantPosId,
                    description = order.description,
                    currencyCode = order.currencyCode,
                    totalAmount = order.totalAmount,
                    buyer = new
                    {
                        email = order.buyer.email,
                        phone = order.buyer.phone,
                        firstName = order.buyer.firstName,
                        lastName = order.buyer.lastName,
                        language = order.buyer.language
                    },
                    products = order.products
                };

                var json = JsonSerializer.Serialize(requestContent);
                var content = new StringContent(json, Encoding.UTF8, "application/json");
                HttpClient.DefaultRequestHeaders.TryAddWithoutValidation("authorization", "Bearer " + token);
                HttpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                using (var response = await HttpClient.PostAsync("https://secure.snd.payu.com/api/v2_1/orders", content))
                {
                    string responseData = await response.Content.ReadAsStringAsync();
                    return JsonSerializer.Deserialize<RedirectResponse.RedirectResponse>(responseData);
                }
            }
        }

        public static async Task<RetrieveRequest.RetrieveRequest> OrderRetrieveRequest(string orderId) {
            using(var HttpClient = new HttpClient())
            {
                var token = await GetAccessTokenAsync();
                HttpClient.DefaultRequestHeaders.TryAddWithoutValidation("authorization", "Bearer " + token);
                HttpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                var response = await HttpClient.GetAsync("https://secure.snd.payu.com/api/v2_1/orders/" + orderId);
                if (response.IsSuccessStatusCode)
                {
                    string responseContent = await response.Content.ReadAsStringAsync();
                    var order = JsonSerializer.Deserialize<RetrieveRequest.RetrieveRequest>(responseContent);
                    return order;
                }
                else return null;
            }
        }
    }    
}