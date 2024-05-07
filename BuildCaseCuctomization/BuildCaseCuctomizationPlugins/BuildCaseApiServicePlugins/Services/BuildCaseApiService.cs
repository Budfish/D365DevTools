using BuildCaseApiServicePlugins.Models;
using Microsoft.Xrm.Sdk;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using static System.Collections.Specialized.BitVector32;

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
            string authUrl = "https://login.microsoftonline.com/54aa2fea-ecb3-4c71-80b3-de9a356e77c1/oauth2/v2.0/token";
            try
            {
                try
                {
                    using (HttpClient client = new HttpClient())
                    {
                        client.Timeout = TimeSpan.FromMilliseconds(15000);
                        client.DefaultRequestHeaders.ConnectionClose = true;

                        HttpContent postBody = new FormUrlEncodedContent(new Dictionary<string, string>
                        {
                            ["grant_type"] = "grant_type",
                            ["client_id"] = "client_id",
                            ["client_secret"] = "client_secret",
                            ["scope"] = "scope"
                        });

                        HttpResponseMessage response = client.PostAsync(authUrl, postBody).Result;
                        response.EnsureSuccessStatusCode();

                        string responseText = response.Content.ReadAsStringAsync().Result;
                        AccessTokenResponseModel responseData = JsonSerializer.Deserialize<AccessTokenResponseModel>(responseText);
                        return responseData.access_token;
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
            throw new Exception($"取得Token失敗。");
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
