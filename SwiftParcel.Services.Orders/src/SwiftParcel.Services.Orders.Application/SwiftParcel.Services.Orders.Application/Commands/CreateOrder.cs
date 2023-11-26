﻿using Convey.CQRS.Commands;

namespace SwiftParcel.Services.Orders.Application.Commands
{
    public class CreateOrder: ICommand
    {
        public Guid OrderId { get; }
        public Guid CustomerId { get; }
        public CreateOrder(Guid id, Guid customerId)
        {
            OrderId = id == Guid.Empty ? Guid.NewGuid() : id;
            CustomerId = customerId;
        }
    }
}


