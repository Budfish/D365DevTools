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
        private bool debug = true;
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
            if (debug) tracer.Trace("RefreshSharepointTokenPlugin activated.");

            Entity target = context.InputParameters["Target"] as Entity;
            if (debug) tracer.Trace($"target={target.LogicalName}({target.Id})");
            var connection = GetConnection();
            if (debug) tracer.Trace($"connection.site_domain={connection.site_domain}");
            if (debug) tracer.Trace($"connection.client_id={connection.client_id}");
            if (debug) tracer.Trace($"connection.client_secret={connection.client_secret}");
            if (debug) tracer.Trace($"connection.tenant_id={connection.tenant_id}");
            var request = new TokenApiRequestModel(connection);
            if (debug) tracer.Trace($"request.source_url={request.source_url}");
            if (debug) tracer.Trace($"request.grant_type={request.grant_type}");
            if (debug) tracer.Trace($"request.client_id={request.client_id}");
            if (debug) tracer.Trace($"request.client_secret={request.client_secret}");
            if (debug) tracer.Trace($"request.resource={request.resource}");
            string token = GetToken(request);
            if (debug) tracer.Trace($"token={token}");
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
                if (debug) tracer.Trace($"responseText={responseText}");

                TokenApiResponseModel tokenResponse = JsonConvert.DeserializeObject<TokenApiResponseModel>(responseText);
                if (debug) tracer.Trace($"tokenResponse.source_url={tokenResponse.token_type}");
                if (debug) tracer.Trace($"tokenResponse.expires_in={tokenResponse.expires_in}");
                if (debug) tracer.Trace($"tokenResponse.not_before={tokenResponse.not_before}");
                if (debug) tracer.Trace($"tokenResponse.expires_on={tokenResponse.expires_on}");
                if (debug) tracer.Trace($"tokenResponse.resource={tokenResponse.resource}");
                if (debug) tracer.Trace($"tokenResponse.access_token={tokenResponse.access_token}");
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
