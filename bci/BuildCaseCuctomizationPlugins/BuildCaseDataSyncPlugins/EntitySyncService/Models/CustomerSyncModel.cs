using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BuildCaseDataSyncPlugins.EntitySyncService.Models
{
    public class CustomerSyncModel
    {
        public string result { get; set; }
        public string message { get; set; }
        public DataResult[] dataResult { get; set; }

        public class DataResult
        {
            public string dataType { get; set; }
            public string dataCode { get; set; }
            public string dataName { get; set; }
            public string inUse { get; set; }
        }
    }
}
