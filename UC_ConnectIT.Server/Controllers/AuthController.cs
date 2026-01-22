using Microsoft.AspNetCore.Mvc;

namespace UC_ConnectIT.Server.Controllers
{
    public class AuthController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
