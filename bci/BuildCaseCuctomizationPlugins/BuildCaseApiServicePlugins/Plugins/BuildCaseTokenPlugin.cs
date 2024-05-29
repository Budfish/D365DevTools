using BuildCaseApiServicePlugins.Services;
using Microsoft.Xrm.Sdk;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BuildCaseApiServicePlugins.Plugins
{
    public class BuildCaseTokenPlugin : IPlugin
    {
        private IOrganizationService service;
        private IExecutionContext context;
        private ITracingService tracer;
        public void Execute(IServiceProvider serviceProvider)
        {
            context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
            IOrganizationServiceFactory serviceFactory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
            service = serviceFactory.CreateOrganizationService(context.UserId);
            tracer = (ITracingService)serviceProvider.GetService(typeof(ITracingService));

            BuildCaseApiService apiService = new BuildCaseApiService(context, service, tracer);
            string token = apiService.GetAccessToken();

            context.OutputParameters["Token"] = token;
        }
    }
}
