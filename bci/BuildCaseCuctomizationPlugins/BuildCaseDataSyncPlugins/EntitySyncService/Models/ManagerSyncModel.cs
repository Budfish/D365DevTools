using Microsoft.Xrm.Sdk;
using System;
using System.Collections.Generic;
using System.DirectoryServices.ActiveDirectory;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BuildCaseDataSyncPlugins.EntitySyncService.Models
{
    public class ManagerSyncModel
    {
        public string result { get; set; }
        public string message { get; set; }
        public DataResult[] dataResult { get; set; }

        public class DataResult
        {
            public string empID { get; set; }
            public string empTwName { get; set; }
            public string empCorpOrgID { get; set; }
            public string corpOrgName { get; set; }
            public string corpOrgIdSeq { get; set; }
            public string corpOrgNameSeq { get; set; }
        }
    }
}
