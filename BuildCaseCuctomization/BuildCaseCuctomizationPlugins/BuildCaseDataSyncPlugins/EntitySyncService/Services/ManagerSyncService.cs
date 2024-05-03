using BuildCaseDataSyncPlugins.EntitySyncService.Models;
using Microsoft.Xrm.Sdk;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace BuildCaseDataSyncPlugins.EntitySyncService.Services
{
    internal class ManagerSyncService : OptionSyncServiceBase
    {
        protected virtual string roleType { get; }
        public ManagerSyncService(IExecutionContext context, IOrganizationService service, ITracingService tracer) : base(context, service, tracer) { }
        protected override string syncApiAction => "GetManager";
        protected override string syncApiPostBody => $"{{\"RoleType\":\"{roleType}\"}}";
        protected override string entityLogicalName => "art_Manager";
        protected override string entityKeyName => "art_EmpId";
        protected override Entity ConvertD365EntityData(object apiData)
        {
            Entity record = new Entity(entityLogicalName);
            ManagerSyncModel.DataResult data = apiData as ManagerSyncModel.DataResult;
            record["art_RoleType"] = roleType;
            record["art_EmpId"] = data.empID;
            record["art_EmpTwName"] = data.empTwName;
            return record;
        }
        protected override void DeserializeAndUpsert(string resultStr)
        {
            ManagerSyncModel result = JsonSerializer.Deserialize<ManagerSyncModel>(resultStr);
            foreach(var data in result.dataResult)
            {
                Entity entityData = ConvertD365EntityData(data);
                UpsertRecord(entityData);
            }
        }
    }
}
