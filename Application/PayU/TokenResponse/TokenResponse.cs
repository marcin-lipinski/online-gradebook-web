using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.PayU.TokenResponse
{
    public class TokenResponse
    {
        public string access_token { get; set; }
        public string token_type { get; set; }
        public int expires_in { get; set; }
        public string grant_type { get; set; }
    }
}