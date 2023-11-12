using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SwiftParcel.Services.Availability.Application.Exceptions
{
    public class InvalidCustomerStateException : AppException
    {
        public override string Code { get; } = "invalid_customer_state";
        public Guid Id { get; }
        public string State { get; }

        public InvalidCustomerStateException(Guid id, string state)
            : base($"Customer with id: {id} has invalid state: {state}.")
            => (Id, State) = (id, state);
    }
}