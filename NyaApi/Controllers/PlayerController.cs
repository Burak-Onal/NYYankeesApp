using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace NyaApi.Controllers
{
    public class PlayerController : ApiController
    {
        private nya_exampleEntities db = new nya_exampleEntities();

        [Route("api/player/byteam/{teamId}/{start}/{End}")]
        [HttpGet]
        public IEnumerable<player> GetPlayersByTeam(int teamId, int start, int end)
        {
            IEnumerable<player> playerByTeam = null;
            int lengthOfSet = db.teams.Count();

            if (start < lengthOfSet)
            {
                end = end > lengthOfSet ? lengthOfSet : end;
                if (teamId != 0)
                    playerByTeam = db.players.Where(p => p.teamid == teamId).OrderBy(p => p.firstname).ToList().GetRange(start, end - start);
            }
            return playerByTeam;
        }

        [Route("api/player/{playerId}")]
        [HttpGet]
        public player GetPlayer(int playerId)
        {
            player player = null;

            if(playerId != 0)
                player = db.players.Where(p => p.playerid == playerId).FirstOrDefault();

            return player;
        }

        [Route("api/player/{playerId}/pstats")]
        [HttpGet]
        public IEnumerable<pstatsplayersseasonsbyteam> GetPitchingStatsByPlayer(int playerId)
        {
            IEnumerable<pstatsplayersseasonsbyteam> pstats = null;

            if (playerId != 0)
                pstats = db.pstatsplayersseasonsbyteams.Where(p => p.playerid == playerId).OrderByDescending(p => p.yearid);

            return pstats;
        }

        [Route("api/player/{playerId}/bstats")]
        [HttpGet]
        public IEnumerable<bstatsplayersseasonsbyteam> GetBattingStatsByPlayer(int playerId)
        {
            IEnumerable<bstatsplayersseasonsbyteam> bstats = null;
            
            if (playerId != 0)
                bstats = db.bstatsplayersseasonsbyteams.Where(p => p.playerid == playerId).OrderByDescending(p => p.yearid);

            return bstats;
        }

        [Route("api/player/{firstName}/{lastName}")]
        [HttpGet]
        public IEnumerable<player> GetPlayerByName(string firstName, string lastName)
        {
            IEnumerable<player> player = null;

            if(!String.IsNullOrEmpty(firstName) && !String.IsNullOrEmpty(lastName))
                player = db.players.Where(p => p.firstname.StartsWith(firstName) && p.lastname.StartsWith(lastName))
                    .OrderBy(p => p.firstname)
                    .OrderBy(p => p.lastname);

            return player;
        }
    }
}