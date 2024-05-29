using System;
using System.Collections.Generic;
using System.DirectoryServices.ActiveDirectory;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharepointFileControlPlugins.Models
{
    public class TokenApiRequestModel
    {
        public string source_url { get; set; }
        public string grant_type { get; set; }
        public string client_id { get; set; }
        public string client_secret { get; set; }
        public string resource { get; set; }
        public TokenApiRequestModel() { }
        public TokenApiRequestModel(SharepointConnectionModel connection) : this(connection.site_domain, connection.client_id, connection.tenant_id, connection.client_secret) { }
        public TokenApiRequestModel(string site_domain, string client_id, string tenant_id, string secret)
        {
            this.source_url = $"https://accounts.accesscontrol.windows.net/{tenant_id}/tokens/Oauth/2/";
            this.grant_type = "client_credentials";
            this.client_id = $"{client_id}@{tenant_id}";
            this.client_secret = secret;
            this.resource = $"00000003-0000-0ff1-ce00-000000000000/{site_domain}@{tenant_id}";
        }
    }
}
