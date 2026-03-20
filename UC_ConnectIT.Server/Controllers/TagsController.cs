using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UC_ConnectIT.Server.Data;

namespace UC_ConnectIT.Server.Controllers
{
    [ApiController]
    [Route("api/tags")]
    public class TagsController : ControllerBase
    {
        private readonly AppDbContext _db;

        public TagsController(AppDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<IActionResult> GetTags()
        {
            var tags = await _db.Tags
                .Select(t => new
                {
                    id = t.Id,
                    name = t.Name
                })
                .ToListAsync();

            return Ok(tags);
        }
    }
}