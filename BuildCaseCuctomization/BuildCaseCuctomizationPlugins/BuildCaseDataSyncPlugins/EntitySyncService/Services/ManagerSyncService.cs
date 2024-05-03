using BuildCaseDataSyncPlugins.EntitySyncService.Models;
using Microsoft.Xrm.Sdk;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BuildCaseDataSyncPlugins.EntitySyncService.Services
{
    internal class ManagerSyncService : EntitySyncServiceBase
    {
        public ManagerSyncService(IExecutionContext context, IOrganizationService service, ITracingService tracer) : base(context, service, tracer) { }
        protected override string syncApiAction => "";
        protected override string syncApiPostBody => "";
        protected override string entityLogicalName => "";
        protected override string entityKeyName => "";
        protected override Type modelType => typeof(ManagerSyncModel);

        internal override bool CallApiGetData(out string resultStr)
        {
            throw new NotImplementedException();
        }

        internal override Entity ConvertD365EntityData<T>(T apiData)
        {
            throw new NotImplementedException();
        }
    }
}
