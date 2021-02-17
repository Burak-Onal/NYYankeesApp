using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;


namespace NyaApi.Controllers
{
    public class TeamController : ApiController
    {
        private nya_exampleEntities db = new nya_exampleEntities();

        [Route("api/team/{start}/{end}")]
        [HttpGet]
        public IEnumerable<team> GetTeams(int start, int end)
        {
            IEnumerable<team> teams = null;
            int lengthOfSet = db.teams.Count();

            if (start < lengthOfSet)
            {
                end = end > lengthOfSet ? lengthOfSet : end;
                teams = db.teams.OrderBy(t => t.name).ToList().GetRange(start, end - start);
            }
            else
                teams = null;

            return teams;
        }
    }
}