using Microsoft.Xrm.Sdk;
using Newtonsoft.Json;
using SharepointFileControlPlugins.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace SharepointFileControlPlugins.Plugins
{
    public class RefreshSharepointTokenPlugin : IPlugin
    {
        private IPluginExecutionContext context;
        private IOrganizationService service;
        private ITracingService tracer;
        public void Execute(IServiceProvider serviceProvider)
        {
            context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
            IOrganizationServiceFactory serviceFactory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
            service = serviceFactory.CreateOrganizationService(context.UserId);
            tracer = (ITracingService)serviceProvider.GetService(typeof(ITracingService));
            if (!context.InputParameters.Contains("Target") || !(context.InputParameters["Target"] is Entity)) return;

            Entity target = context.InputParameters["Target"] as Entity;
            var connection = GetConnection();
            var request = new TokenApiRequestModel(connection);
            string token = GetToken(request);
            target["art_token"] = token;
        }
        private string GetToken(TokenApiRequestModel requestParam)
        {
            string token = "default";
            using (HttpClient client = new HttpClient())
            {
                client.Timeout = TimeSpan.FromMilliseconds(10000);
                client.DefaultRequestHeaders.ConnectionClose = true;
                var formdata = new MultipartFormDataContent
                {
                    { new StringContent(requestParam.grant_type), "grant_type" },
                    { new StringContent(requestParam.client_id), "client_id" },
                    { new StringContent(requestParam.client_secret), "client_secret" },
                    { new StringContent(requestParam.resource), "resource" }
                };

                HttpResponseMessage response = client.PostAsync(requestParam.source_url, formdata).Result;
                string responseText = response.Content.ReadAsStringAsync().Result;

                TokenApiResponseModel tokenResponse = JsonConvert.DeserializeObject<TokenApiResponseModel>(responseText);
                token = tokenResponse.access_token;
            }
            return token;
        }
        private SharepointConnectionModel GetConnection()
        {
            var request = new OrganizationRequest("RetrieveEnvironmentVariableValue");
            request.Parameters["DefinitionSchemaName"] = "art_SharepointConnection";
            var response = service.Execute(request);
            var value = response.Results["Value"];
            string json = value != null ? value.ToString() : "{}";
            var obj = JsonConvert.DeserializeObject<SharepointConnectionModel>(json);
            return obj;
        }
    }
}
