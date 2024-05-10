using ConnectionTest.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.PowerPlatform.Dataverse.Client;
using Microsoft.Xrm.Sdk;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ConnectionTest
{
    internal class Program
    {
        static void Main(string[] args)
        {
            ServiceClient service = new CrmServiceBuilder().ServiceClient;

            Entity entityData = service.Retrieve("art_temptable", new Guid("8df11c3b-effa-ee11-9f89-00224859afce"), new Microsoft.Xrm.Sdk.Query.ColumnSet(true));

            foreach(var attr in entityData.Attributes)
            {
                string info = attr.Key + "=" + attr.Value;
                Console.WriteLine(info);
            }

            Console.WriteLine("Program Ends.");
            Console.Read();
        }
    }
}
