using BuildCaseDataSyncPlugins.EntitySyncService.Services;
using Microsoft.Xrm.Sdk;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BuildCaseDataSyncPlugins.EntitySyncService
{
    internal class OptionSyncServiceFacotry
    {
        private IOrganizationService service;
        private IExecutionContext context;
        private ITracingService tracer;
        public OptionSyncServiceFacotry(IExecutionContext context, IOrganizationService service, ITracingService tracer)
        {
            this.service = service;
            this.tracer = tracer;
            this.context = context;
        }
        internal OptionSyncServiceBase GetService(string optionCode)
        {
            switch(optionCode)
            {
                case "AccountManager":
                    {
                        return new AccountManagerSyncService(context, service, tracer);
                    }
                case "ProjectManager":
                    {
                        return new AccountManagerSyncService(context, service, tracer);
                    }
                case "Organization":
                    {
                        throw new NotImplementedException();
                    }
                case "Customer":
                    {
                        throw new NotImplementedException();
                    }
            }
            throw new Exception($"[Error] unexpected optionCode: {optionCode}");
        }
    }
}
