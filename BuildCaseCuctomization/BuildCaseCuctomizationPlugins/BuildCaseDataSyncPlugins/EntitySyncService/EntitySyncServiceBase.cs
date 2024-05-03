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
    internal abstract class EntitySyncServiceBase
    {
        protected IOrganizationService service;
        protected IExecutionContext context;
        protected ITracingService tracer;
        protected abstract string syncApiAction { get; }
        protected abstract string syncApiPostBody { get; }
        protected abstract string entityLogicalName { get; }
        protected abstract string entityKeyName { get; }
        protected abstract Type modelType { get; }
        public EntitySyncServiceBase(IExecutionContext context, IOrganizationService service, ITracingService tracer)
        {
            this.service = service;
            this.tracer = tracer;
            this.context = context;
        }
        internal abstract bool CallApiGetData(out string resultStr);
        internal abstract Entity ConvertD365EntityData<T>(T apiData);
        internal void RetrieveDataAndSync<T>()
        {
            bool apiSuccess = CallApiGetData(out string resultStr);
            if(!apiSuccess)
            {
                tracer.Trace("[Error] CallApiGetData fails.");
                tracer.Trace(resultStr);
                return;
            }

            T[] result;
            try
            {
                result = JsonSerializer.Deserialize<T[]>(resultStr);
            }
            catch (Exception)
            {
                tracer.Trace("[Error] JsonDeserialize fails.");
                tracer.Trace(resultStr);
                return;
            }

            foreach (T item in result)
            {
                Entity entityData = ConvertD365EntityData(item);
                UpsertRecord(entityData);
            }
        }
        private void UpsertRecord(Entity entity)
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
