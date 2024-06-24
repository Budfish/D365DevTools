using Microsoft.Xrm.Sdk;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ExceptionLogPlugin
{
    public class LogException : IPlugin
    {
        ITracingService tracingService { get; set; }
        IPluginExecutionContext context { get; set; }
        IOrganizationServiceFactory serviceFactory { get; set; }
        IOrganizationService service { get; set; }
        public void Execute(IServiceProvider serviceProvider)
        {
            tracingService = (ITracingService)serviceProvider.GetService(typeof(ITracingService));
            context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
            serviceFactory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
            service = serviceFactory.CreateOrganizationService(context.UserId);

            //input params
            string entityLogicalName = context.InputParameters["EntityLogicalName"].ToString();
            string recordId = context.InputParameters["RecordId"].ToString();
            string exceptionTitle = context.InputParameters["ExceptionTitle"].ToString();
            string exceptionDescription = context.InputParameters["ExceptionDescription"].ToString();

            Entity exLogForm = new Entity("art_exceptionlog");
            exLogForm["art_entitylogicalname"] = entityLogicalName;
            exLogForm["art_recordid"] = recordId;
            exLogForm["art_exceptiontitle"] = exceptionTitle;
            exLogForm["art_exceptiondescription"] = exceptionDescription;

            service.Create(exLogForm);
        }
    }
}
