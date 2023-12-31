﻿using Convey.CQRS.Commands;
using Convey.CQRS.Events;
using SwiftParcel.Services.Deliveries.Application.Commands;

namespace SwiftParcel.Services.Deliveries.Application.Events.External.Handlers
{
    public class OrderApprovedHandler: IEventHandler<OrderApproved>
    {
        ICommandDispatcher _commandDispatcher;
        public OrderApprovedHandler(ICommandDispatcher commandDispatcher)
        {
            _commandDispatcher = commandDispatcher;
        }

        public async Task HandleAsync(OrderApproved @event)
        {
            var volume = @event.Width * @event.Height * @event.Depth;
            await _commandDispatcher.SendAsync(new StartDelivery(Guid.Empty, @event.OrderId, volume, 
            @event.Weight, @event.Source, @event.Destination, @event.Priority, @event.AtWeekend, @event.PickupDate, @event.DeliveryDate));
        }
    }
}
