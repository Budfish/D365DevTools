using Microsoft.Xrm.Sdk;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BuildCaseDataSyncPlugins.EntitySyncService.Services
{
    internal class ProjectManagerSyncService : ManagerSyncService
    {
        protected override string roleType => "PM";
        public ProjectManagerSyncService(IExecutionContext context, IOrganizationService service, ITracingService tracer) : base(context, service, tracer) { }
    }
}
