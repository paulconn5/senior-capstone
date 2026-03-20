using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UC_ConnectIT.Server.Data;

namespace UC_ConnectIT.Server.Controllers
{
    [ApiController]
    [Route("api/degrees")]
    public class DegreesController : ControllerBase
    {
        private readonly AppDbContext _db;

        public DegreesController(AppDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<IActionResult> GetDegrees()
        {
            var degrees = await _db.Degrees
                .Select(d => new
                {
                    id = d.Id,
                    name = d.Name
                })
                .ToListAsync();

            return Ok(degrees);
        }
    }
}