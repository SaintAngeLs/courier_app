﻿using Convey.CQRS.Events;

namespace SwiftParcel.Services.Orders.Application.Events.Rejected
{
    public class ApproveOrderRejected : IRejectedEvent
    {
        public Guid OrderId { get; }
        public string Reason { get; }
        public string Code { get; }

        public ApproveOrderRejected(Guid orderId, string reason, string code)
        {
            OrderId = orderId;
            Reason = reason;
            Code = code;
        }
    }
}