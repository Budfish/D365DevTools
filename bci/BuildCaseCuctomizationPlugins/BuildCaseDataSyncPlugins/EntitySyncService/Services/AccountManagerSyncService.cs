using Microsoft.Xrm.Sdk;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BuildCaseDataSyncPlugins.EntitySyncService.Services
{
    internal class AccountManagerSyncService : ManagerSyncService
    {
        protected override string roleType => "AM";
        public AccountManagerSyncService(IExecutionContext context, IOrganizationService service, ITracingService tracer) : base(context, service, tracer) { }
    }
}
