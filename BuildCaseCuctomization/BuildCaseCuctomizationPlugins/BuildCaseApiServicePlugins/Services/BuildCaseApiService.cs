using Microsoft.Xrm.Sdk;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace BuildCaseApiServicePlugins.Services
{
    internal class BuildCaseApiService
    {
        private IOrganizationService service;
        private IExecutionContext context;
        private ITracingService tracer;
        private string domain { get; set; }
        public BuildCaseApiService(IExecutionContext context, IOrganizationService service, ITracingService tracer)
        {
            this.service = service;
            this.tracer = tracer;
            this.context = context;

            domain = GetDomain();
        }
        private string GetDomain()
        {
            var request = new OrganizationRequest("RetrieveEnvironmentVariableValue");
            request.Parameters["DefinitionSchemaName"] = "art_BuildCaseApiEndPoint";
            var response = service.Execute(request);
            var value = response.Results["Value"];
            return value != null ? value.ToString() : "";
        }
        private string GetAccessToken()
        {
            return "";
        }
        private string GetApiRoute(string action)
        {
            return domain + action;
        }
        internal string GetResponseString(string action, string requestBodyJson)
        {
            string apiRoute = GetApiRoute(action);
            string accessToken = GetAccessToken();
            try
            {
                try
                {
                    using (HttpClient client = new HttpClient())
                    {
                        client.Timeout = TimeSpan.FromMilliseconds(15000);
                        client.DefaultRequestHeaders.ConnectionClose = true;
                        client.DefaultRequestHeaders.Add("Authorization", "Bearer " + accessToken);

                        HttpContent postBody = new StringContent(requestBodyJson, Encoding.UTF8, "application/json");
                        HttpResponseMessage response = client.PostAsync(apiRoute, postBody).Result;
                        response.EnsureSuccessStatusCode();

                        string responseText = response.Content.ReadAsStringAsync().Result;
                        return responseText;
                    }
                }
                #region catch AggregateException
                catch (AggregateException aex)
                {
                    tracer.Trace("Inner Exceptions:");
                    foreach (Exception ex in aex.InnerExceptions)
                    {
                        tracer.Trace("  Exception: {0}", ex.ToString());
                    }
                    string errorMessage = string.Format(CultureInfo.InvariantCulture, "An exception occurred while attempting to issue the request.", aex);
                    throw new InvalidPluginExecutionException(errorMessage);
                }
                #endregion
            }
            #region catch Exception
            catch (Exception e)
            {
                tracer.Trace("Exception: {0}", e.ToString());
            }
            #endregion
            return $"Api: {action} 呼叫失敗。";
        }
    }
}
