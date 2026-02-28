using Microsoft.AspNetCore.Authentication;
using Microsoft.EntityFrameworkCore;
using Server.Database;
using System.Security.Claims;

public class RoleClaimsTransformation : IClaimsTransformation
{
    private readonly ApplicationDbContext _context;

    public RoleClaimsTransformation(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ClaimsPrincipal> TransformAsync(ClaimsPrincipal principal)
    {
        if (!principal.Identity!.IsAuthenticated)
            return principal;

        var identity = (ClaimsIdentity)principal.Identity;

        var windowsUsername = identity.Name;

        if (windowsUsername == null)
            return principal;

        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Username == windowsUsername);

        if (user != null &&
            !identity.HasClaim(c => c.Type == ClaimTypes.Role))
        {
            identity.AddClaim(new Claim(ClaimTypes.Role, user.Role.ToString()));
        }

        return principal;
    }
}