﻿using System;
using Convey.CQRS.Events;

namespace SwiftParcel.Services.Orders.Application.Events
{
    public class ParcelAddedToOrder : IEvent
    {
        public Guid OrderId { get; }
        public Guid ParcelId { get; }
        public ParcelAddedToOrder(Guid orderId, Guid parcelId)
        {
            OrderId = orderId;
            ParcelId = parcelId;
        }
    }
}