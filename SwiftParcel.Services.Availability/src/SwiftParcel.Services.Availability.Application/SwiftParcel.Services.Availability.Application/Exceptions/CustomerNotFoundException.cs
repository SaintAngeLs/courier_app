using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SwiftParcel.Services.Availability.Application.Exceptions
{
    public class CustomerNotFoundException : AppException
    {
        public override string Code { get; } = "customer_not_found";
        public Guid Id { get; }

        public CustomerNotFoundException(Guid id) : base($"Customer with id: {id} was not found.")
            => Id = id;
    }
}