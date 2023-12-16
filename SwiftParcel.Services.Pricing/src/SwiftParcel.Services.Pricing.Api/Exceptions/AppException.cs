using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SwiftParcel.Services.Pricing.Api.Exceptions
{
    public abstract class AppException : Exception
    {
        public virtual string Code { get; }

        protected AppException(string message) : base(message)
        {
        }
    }
}