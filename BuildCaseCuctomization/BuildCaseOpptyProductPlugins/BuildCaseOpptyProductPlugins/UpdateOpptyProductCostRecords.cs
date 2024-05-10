using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Messages;
using Microsoft.Xrm.Sdk.Query;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BuildCaseOpptyProductPlugins
{
    public class UpdateOpptyProductCostRecords : IPlugin
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
            tracer.Trace("執行 UpdateOpptyProductCostRecords_plugin");

            string opportunityId = "";
            int executionEndYear;
            int executionStartYear;
            string[] yearsArray;
            tracer.Trace($"opportunityId = {opportunityId}");

            if (context.InputParameters.ContainsKey("OpportunityId"))
            {
                opportunityId = context.InputParameters["OpportunityId"].ToString();
            }
            tracer.Trace($"opportunityId = {opportunityId}");
            if (string.IsNullOrEmpty(opportunityId)) return;
            tracer.Trace($"new Guid(opportunityId) = {new Guid(opportunityId)}");

            Entity opportunityEntity = service.Retrieve("opportunity", new Guid(opportunityId), new ColumnSet("art_executionenddate", "art_executionstartdate"));

            if (opportunityEntity.TryGetAttributeValue("art_executionenddate", out DateTime executionenddate))
            {
                tracer.Trace($"executionenddate = {executionenddate}");// 取得年份
                executionEndYear = executionenddate.Year;
            }
            else return;

            if (opportunityEntity.TryGetAttributeValue("art_executionstartdate", out DateTime executionstartdate))
            {
                tracer.Trace($"executionstartdate = {executionstartdate}");
                executionStartYear = executionstartdate.Year;
            }
            else return;

            if (executionEndYear > executionStartYear)
            {
                int temp = executionEndYear;
                executionEndYear = executionStartYear;
                executionStartYear = temp;
            }
            yearsArray = Enumerable.Range(executionEndYear, executionStartYear - executionEndYear + 1).Select(x => x.ToString()).ToArray();
            // 輸出陣列
            tracer.Trace("Numbers between " + executionEndYear + " and " + executionStartYear + ":");
            foreach (string year in yearsArray)
            {
                tracer.Trace(year.ToString());
            }

            EntityCollection matchingRecords = QueryMatchingRecords("art_opptyproductcost", new Guid(opportunityId), service);

            foreach (Entity entity in matchingRecords.Entities)
            {
                if (entity.TryGetAttributeValue("art_year", out string art_year))
                {
                    tracer.Trace("art_year : " + art_year);

                    // 如果 artYearInt 在 yearsArray 中，則從 yearsArray 中移除
                    if (yearsArray.Contains(art_year))
                    {
                        yearsArray = yearsArray.Where(y => y != art_year).ToArray();
                    }
                    else
                    {
                        service.Delete(entity.LogicalName, entity.Id);
                        tracer.Trace("New record Delete with ID: " + entity.Id);
                    }
                }
            }
            CreateRecords(yearsArray, opportunityEntity);
            // 將結果設置為輸出參數
            context.OutputParameters["Success"] = "Success";
        }

        private void CreateRecords(string[] yearsArray, Entity opportunityEntity)
        {
            decimal defaultValue = new decimal(0);
            foreach (string year in yearsArray)
            {
                tracer.Trace(year.ToString());

                // 創建一個新的實體記錄
                Entity newRecord = new Entity("art_opptyproductcost");

                // 設置新記錄的屬性值
                newRecord["art_opportunity"] = new EntityReference(opportunityEntity.LogicalName, opportunityEntity.Id);
                newRecord["art_year"] = year;
                newRecord["art_band1"] = defaultValue;
                newRecord["art_band2"] = defaultValue;
                newRecord["art_band3"] = defaultValue;
                newRecord["art_band4"] = defaultValue;
                newRecord["art_band5"] = defaultValue;
                newRecord["art_band6"] = defaultValue;
                newRecord["art_band7"] = defaultValue;
                newRecord["art_band8"] = defaultValue;
                newRecord["art_band9"] = defaultValue;


                // 使用組織服務的 Create 方法來創建新記錄
                Guid newRecordId = service.Create(newRecord);

                tracer.Trace("New record created with ID: " + newRecordId);
            }
        }

        public EntityCollection QueryMatchingRecords(string entityName, Guid opportunityId, IOrganizationService service)
        {
            QueryExpression query = new QueryExpression()
            {
                EntityName = entityName,
                ColumnSet = new ColumnSet("art_year"),
                Criteria = new FilterExpression(),
            };
            query.Criteria.AddCondition("art_opportunity", ConditionOperator.Equal, opportunityId);
            EntityCollection records = service.RetrieveMultiple(query);
            return records;
        }
    }
}
