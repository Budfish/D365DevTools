using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BuildCaseDataSyncPlugins.EntitySyncService.Models
{
    public class OrganizationSyncModel
    {
        public string result { get; set; }
        public string message { get; set; }
        public DataResult[] dataResult { get; set; }

        public class DataResult
        {
            public string orgType { get; set; }
            public string authType { get; set; }
            public string corpOrgID { get; set; }
            public string corpOrgTwName { get; set; }
            public string lev { get; set; }
            public string sysLevel { get; set; }
            public string corpRegionCd { get; set; }
            public string managerEmpID { get; set; }
            public string managerEmpTwName { get; set; }
            public string deptID { get; set; }
            public string deptName { get; set; }
            public string divID { get; set; }
            public string divName { get; set; }
            public string unitID { get; set; }
            public string unitName { get; set; }
            public string parentCorpOrgID { get; set; }
            public string parentCorpOrgTwName { get; set; }
            public string idSeq { get; set; }
            public string nameSeq { get; set; }
            public string corpOrgCatgCd { get; set; }
            public string misTeamno { get; set; }
            public string isMisCreate { get; set; }
        }
    }
}
