using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Convey.Auth;
using SwiftParcel.Services.Identity.Application.Services;
using SwiftParcel.Services.Identity.Application.UserDTO;

namespace SwiftParcel.Services.Identity.Infrastructure.Auth
{
    public class JwtProvider : IJwtProvider
    {
        private readonly IJwtHandler _jwtHandler;

        public JwtProvider(IJwtHandler jwtHandler)
        {
            _jwtHandler = jwtHandler;
        }

        public AuthDto Create(Guid userId, string role, string audience = null,
            IDictionary<string, IEnumerable<string>> claims = null)
        {
            var jwt = _jwtHandler.CreateToken(userId.ToString("N"), role, audience, claims);

            return new AuthDto
            {
                AccessToken = jwt.AccessToken,
                Role = jwt.Role,
                Expires = jwt.Expires
            };
        }
    }
}