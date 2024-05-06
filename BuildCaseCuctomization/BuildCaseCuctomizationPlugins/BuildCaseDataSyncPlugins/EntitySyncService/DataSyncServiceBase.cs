using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace BuildCaseDataSyncPlugins.EntitySyncService
{
    internal abstract class DataSyncServiceBase
    {
        protected IOrganizationService service;
        protected IExecutionContext context;
        protected ITracingService tracer;
        protected abstract string syncApiAction { get; }
        protected abstract string syncApiPostBody { get; }
        protected abstract string entityLogicalName { get; }
        protected abstract string entityKeyName { get; }
        public DataSyncServiceBase(IExecutionContext context, IOrganizationService service, ITracingService tracer)
        {
            this.service = service;
            this.tracer = tracer;
            this.context = context;
        }
        protected abstract Entity ConvertD365EntityData(object apiData);
        protected abstract void DeserializeAndUpsert(string resultStr);
        internal virtual void RetrieveDataAndSync()
        {
            bool apiSuccess = CallApiGetResponse(out string resultStr);
            if(!apiSuccess)
            {
                tracer.Trace("[Error] CallApiGetData fails.");
                tracer.Trace(resultStr);
                return;
            }

            DeserializeAndUpsert(resultStr);
        }
        protected bool CallApiGetResponse(out string resultStr)
        {
            OrganizationRequest request = new OrganizationRequest("art_CallBuildCaseApi");
            request.Parameters.Add("Action", syncApiAction);
            request.Parameters.Add("InputParamStr", syncApiPostBody);
            OrganizationResponse response = service.Execute(request);

            bool success = false;
            resultStr = "ResultStr Not Set.";
            if (response.Results.Contains("Success"))
            {
                success = response.Results["Success"].ToString().ToLower() == "true";
            }
            if (response.Results.Contains("ResultStr"))
            {
                resultStr = response.Results["ResultStr"].ToString();
            }
            return success;
        }
        protected void UpsertRecord(Entity entity)
        {
            QueryExpression query = new QueryExpression()
            {
                EntityName = entityLogicalName,
                Criteria = new FilterExpression(),
            };
            query.Criteria.AddCondition(entityKeyName, ConditionOperator.Equal, entity[entityKeyName]);
            EntityCollection existingRecord = service.RetrieveMultiple(query);

            if (existingRecord.Entities.Count == 0)
            {
                service.Create(entity);
            }
            else
            {
                Entity updateRecord = existingRecord.Entities.First();
                entity.Id = updateRecord.Id;
                service.Update(entity);
            }
        }
    }
}
