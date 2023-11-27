﻿using Convey.CQRS.Events;

namespace SwiftParcel.Services.Orders.Application.Events.Rejected
{
    public class AddParcelToOrderRejected: IRejectedEvent
    {
        public Guid OrderId { get; }
        public Guid ParcelId { get; }
        public string Reason { get; }
        public string Code { get; }

        public AddParcelToOrderRejected(Guid orderId, Guid parcelId, string reason, string code)
        {
            OrderId = orderId;
            ParcelId = parcelId;
            Reason = reason;
            Code = code;
        }
    }
}