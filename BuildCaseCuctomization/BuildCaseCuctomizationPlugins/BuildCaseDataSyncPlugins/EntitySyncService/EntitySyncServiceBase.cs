using Microsoft.Xrm.Sdk;
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
        private IOrganizationService service;
        private IExecutionContext context;
        private ITracingService tracer;
        protected abstract string syncApiAction { get; set; }
        protected abstract string entityLogicalName { get; set; }
        protected abstract string entityKeyName { get; set; }
        protected abstract Type modelType { get; set; }
        protected abstract Dictionary<string, string> fieldMap { get; set; }
        public EntitySyncServiceBase(IExecutionContext context, IOrganizationService service, ITracingService tracer)
        {
            this.service = service;
            this.tracer = tracer;
            this.context = context;
        }
        internal void RetrieveDataAndSync<T>()
        {
            T[] result = JsonSerializer.Deserialize<T[]>("");
            foreach (T item in result)
            {
                Entity entityData = ConvertD365EntityData(item);
                UpsertRecord(entityData);
            }
        }
        internal bool CallApiGetData(out string resultStr)
        {
            resultStr = "";
            return true;
        }
        internal abstract Entity ConvertD365EntityData<T>(T apiData);
        internal void UpsertRecord(Entity entity)
        {

        }
    }
}
