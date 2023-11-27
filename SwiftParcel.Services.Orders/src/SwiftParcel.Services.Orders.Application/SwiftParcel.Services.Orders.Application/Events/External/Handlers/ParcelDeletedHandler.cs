﻿using System.Threading.Tasks;
using Convey.CQRS.Events;
using SwiftParcel.Services.Orders.Core.Repositories;
using SwiftParcel.Services.Orders.Application.Services;

namespace SwiftParcel.Services.Orders.Application.Events.External.Handlers
{
    public class ParcelDeletedHandler : IEventHandler<ParcelDeleted>
    {
        private readonly IOrderRepository _orderRepository;
        private readonly IMessageBroker _messageBroker;
        private readonly IEventMapper _eventMapper;

        public ParcelDeletedHandler(IOrderRepository orderRepository, IMessageBroker messageBroker,
            IEventMapper eventMapper)
        {
            _orderRepository = orderRepository;
            _messageBroker = messageBroker;
            _eventMapper = eventMapper;
        }

        public async Task HandleAsync(ParcelDeleted @event, CancellationToken cancellationToken)
        {
            var order = await _orderRepository.GetContainingParcelAsync(@event.ParcelId);
            if (order is null)
            {
                return;
            }

            order.DeleteParcel(@event.ParcelId);
            await _orderRepository.UpdateAsync(order);
            var events = _eventMapper.MapAll(order.Events);
            await _messageBroker.PublishAsync(events.ToArray());
        }
    }
}