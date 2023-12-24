﻿using Convey.CQRS.Events;
using Convey.MessageBrokers;

namespace SwiftParcel.Services.Orders.Application.Events.External
{
    [Message("deliveries")]
    public class DeliveryCompleted : IEvent
    {
        public Guid DeliveryId { get; }
        public Guid OrderId { get; }
        public DateTime DateTime { get; }

        public DeliveryCompleted(Guid deliveryId, Guid orderId, DateTime dateTime)
        {
            DeliveryId = deliveryId;
            OrderId = orderId;
            DateTime = dateTime;
        }
    }
}