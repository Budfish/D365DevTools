using BuildCaseDataSyncPlugins.EntitySyncService;
using Microsoft.Xrm.Sdk;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Collections.Specialized.BitVector32;

namespace BuildCaseDataSyncPlugins.Plugins
{
    public class SyncBuildCaseDataPlugin : IPlugin
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

            string optionCode = "";
            if (context.InputParameters.ContainsKey("OptionCode"))
            {
                optionCode = context.InputParameters["OptionCode"].ToString();
            }
            OptionSyncServiceFacotry factory = new OptionSyncServiceFacotry(context, service, tracer);
            OptionSyncServiceBase syncService = factory.GetService(optionCode);
            syncService.RetrieveDataAndSync();
        }
    }
}
