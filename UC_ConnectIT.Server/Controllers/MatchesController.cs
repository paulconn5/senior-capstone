using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using UC_ConnectIT.Server.Data;
using UC_ConnectIT.Server.Models;

namespace UC_ConnectIT.Server.Controllers
{
    [ApiController]
    [Route("api/matches")]
    [Authorize]
    public class MatchesController : ControllerBase
    {
        private readonly AppDbContext _db;

        public MatchesController(AppDbContext db)
        {
            _db = db;
        }

        // Retrieves potential matches for the authenticated user.
        // Returns users of the opposite role ordered by computed match score.
        [HttpGet]
        public async Task<IActionResult> GetMatches(int limit = 50)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null) return Unauthorized();
            if (!int.TryParse(userIdClaim, out var userId)) return Unauthorized();

            // Load current user with tags & degrees and hierarchical relationships
            var current = await _db.Users
                .Include(u => u.UserTags)
                    .ThenInclude(ut => ut.Tag)
                        .ThenInclude(t => t.TagSubcategory)
                            .ThenInclude(sc => sc.TagCategory)
                .Include(u => u.UserDegrees)
                    .ThenInclude(ud => ud.Degree)
                        .ThenInclude(d => d.TagSubcategory)
                            .ThenInclude(sc => sc.TagCategory)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (current == null) return NotFound();

            var currentRole = current.Role ?? "student";

            // Fetch candidates of the opposite role with the same includes
            var candidates = await _db.Users
                .Where(u => u.Id != userId && (u.Role ?? "student") != currentRole)
                .Include(u => u.UserTags)
                    .ThenInclude(ut => ut.Tag)
                        .ThenInclude(t => t.TagSubcategory)
                            .ThenInclude(sc => sc.TagCategory)
                .Include(u => u.UserDegrees)
                    .ThenInclude(ud => ud.Degree)
                        .ThenInclude(d => d.TagSubcategory)
                            .ThenInclude(sc => sc.TagCategory)
                .ToListAsync();

            // Calculate current user's tag/degree groupings
            var curTags = current.UserTags
                .Select(ut => ut.Tag)
                .Where(t => t != null)
                .ToList();

            var curDegrees = current.UserDegrees
                .Select(ud => ud.Degree)
                .Where(d => d != null)
                .ToList();

            List<object> results = new();

            foreach (var cand in candidates)
            {
                int score = 0;

                var candTags = cand.UserTags.Select(ut => ut.Tag).Where(t => t != null).ToList();
                var candDegrees = cand.UserDegrees.Select(ud => ud.Degree).Where(d => d != null).ToList();

                // Degree scoring 
                foreach (var cDeg in candDegrees)
                {
                    foreach (var myDeg in curDegrees)
                    {
                        if (cDeg.Id == myDeg.Id)
                        {
                            score += 20;
                            // exact match
                            continue;
                        }

                        var cSub = cDeg.TagSubcategory;
                        var mSub = myDeg.TagSubcategory;
                        if (cSub != null && mSub != null)
                        {
                            if (cSub.Id == mSub.Id)
                            {
                                score += 12;
                            }
                            else if (cSub.TagCategory != null && mSub.TagCategory != null &&
                                     cSub.TagCategory.Id == mSub.TagCategory.Id)
                            {
                                score += 8;
                            }
                        }
                    }
                }

                // Tag scoring
                foreach (var cTag in candTags)
                {
                    foreach (var myTag in curTags)
                    {
                        if (cTag.Id == myTag.Id)
                        {
                            score += 5;
                            continue;
                        }

                        var cSub = cTag.TagSubcategory;
                        var mSub = myTag.TagSubcategory;
                        if (cSub != null && mSub != null)
                        {
                            if (cSub.Id == mSub.Id)
                            {
                                score += 3;
                            }
                            else if (cSub.TagCategory != null && mSub.TagCategory != null &&
                                     cSub.TagCategory.Id == mSub.TagCategory.Id)
                            {
                                score += 2;
                            }
                        }
                    }
                }

                // Build DTO for client
                var dto = new
                {
                    id = cand.Id,
                    firstName = cand.FirstName,
                    lastName = cand.LastName,
                    role = cand.Role,
                    careerTitle = cand.CareerTitle,
                    aboutMe = cand.AboutMe,
                    score,
                    tags = candTags.Select(t => new
                    {
                        id = t.Id,
                        name = t.Name,
                        subcategoryId = t.TagSubcategoryId,
                        categoryId = t.TagSubcategory?.TagCategoryId
                    }).ToList(),
                    degrees = candDegrees.Select(d => new
                    {
                        id = d.Id,
                        name = d.Name,
                        subcategoryId = d.TagSubcategoryId,
                        categoryId = d.TagSubcategory?.TagCategoryId
                    }).ToList()
                };

                results.Add(dto);
            }

            // Return sorted by score desc, then by name; limit results
            var ordered = results
                .OrderByDescending(r => ((dynamic)r).score)
                .ThenBy(r => ((dynamic)r).lastName)
                .Take(limit)
                .ToList();

            return Ok(ordered);
        }
    }
}