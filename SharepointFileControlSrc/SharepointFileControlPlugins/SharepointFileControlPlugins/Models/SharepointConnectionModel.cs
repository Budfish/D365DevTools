using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharepointFileControlPlugins.Models
{
    public class SharepointConnectionModel
    {
        public string site_domain { get; set; }
        public string client_id { get; set; }
        public string client_secret { get; set;}
        public string tenant_id { get; set; }
    }
}
