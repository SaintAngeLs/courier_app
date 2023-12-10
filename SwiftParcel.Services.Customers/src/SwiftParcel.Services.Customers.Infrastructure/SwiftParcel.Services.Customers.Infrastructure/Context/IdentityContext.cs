using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SwiftParcel.Services.Customers.Application;

namespace SwiftParcel.Services.Customers.Infrastructure.Context
{
    internal class IdentityContext : IIdentityContext
    {
        public Guid Id { get; }
        public string Role { get; } = string.Empty;
        public bool IsAuthenticated { get; }
        public bool IsAdmin { get; }
        public bool IsCourier { get; }

        public IDictionary<string, string> Claims { get; } = new Dictionary<string, string>();

        internal IdentityContext()
        {
        }

        internal IdentityContext(CorrelationContext.UserContext context)
            : this(context.Id, context.Role, context.IsAuthenticated, context.Claims)
        {
        }

        internal IdentityContext(string id, string role, bool isAuthenticated, IDictionary<string, string> claims)
        {
            Id = Guid.TryParse(id, out var userId) ? userId : Guid.Empty;
            Role = role ?? string.Empty;
            IsAuthenticated = isAuthenticated;
            IsAdmin = Role.Equals("admin", StringComparison.InvariantCultureIgnoreCase);
            IsCourier = Role.Equals("courier", StringComparison.InvariantCultureIgnoreCase);
            Claims = claims ?? new Dictionary<string, string>();
        }
        
        internal static IIdentityContext Empty => new IdentityContext();
    }
}