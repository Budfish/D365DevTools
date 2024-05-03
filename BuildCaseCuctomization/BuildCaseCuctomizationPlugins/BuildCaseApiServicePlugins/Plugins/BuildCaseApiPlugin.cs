using BuildCaseApiServicePlugins.Services;
using Microsoft.Xrm.Sdk;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace BuildCaseApiServicePlugins.Plugins
{
    public class BuildCaseApiPlugin : IPlugin
    {
        protected IOrganizationService service;
        protected IExecutionContext context;
        protected ITracingService tracer;
        public void Execute(IServiceProvider serviceProvider)
        {
            context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
            IOrganizationServiceFactory serviceFactory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
            service = serviceFactory.CreateOrganizationService(context.UserId);
            tracer = (ITracingService)serviceProvider.GetService(typeof(ITracingService));

            string action = "";
            string inputParamStr = "";
            if (context.InputParameters.ContainsKey("Action"))
            {
                action = context.InputParameters["Action"].ToString();
            }
            if (context.InputParameters.ContainsKey("InputParamStr"))
            {
                inputParamStr = context.InputParameters["InputParamStr"].ToString();
            }
            BuildCaseApiService apiService = new BuildCaseApiService(context, service, tracer);

            string success = "";
            string resultStr = "";
            try
            {
                resultStr = apiService.GetResponseString(action, inputParamStr);
                success = "true";
            }
            catch (Exception ex)
            {
                resultStr = ex.ToString();
                success = "false";
            }
            context.OutputParameters["Success"] = success;
            context.OutputParameters["ResultStr"] = resultStr;
        }
    }
}
