using Microsoft.Extensions.Configuration;
using Microsoft.PowerPlatform.Dataverse.Client;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace ConnectionTest.Services
{
    internal class CrmServiceBuilder
    {
        public ServiceClient ServiceClient { get; set; }
        public CrmServiceBuilder(string CallerId = "")
        {
            ServiceClient.MaxConnectionTimeout = new TimeSpan(1, 0, 0);
            ServiceClient = GetServiceClient();
            if (!string.IsNullOrEmpty(CallerId) && Guid.TryParse(CallerId, out Guid CallerGuid))
            {
                ServiceClient.CallerId = CallerGuid;
            }
        }
        private ServiceClient GetServiceClient()
        {
            var builder = new ConfigurationBuilder().
                SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json");
            var config = builder.Build();

            string appUrl = config["Url"];
            string appClientId = config["ClientId"];
            string appClientSecret = config["ClientSecret"];

            string connectionString = $@"AuthType=ClientSecret;Url={appUrl};ClientId={appClientId};ClientSecret={appClientSecret}";
            return new ServiceClient(connectionString);
        }
    }
}
