﻿using Convey.CQRS.Commands;
using SwiftParcel.Services.Deliveries.Application.Exceptions;
using SwiftParcel.Services.Deliveries.Application.Services;
using SwiftParcel.Services.Deliveries.Core.Repositories;

namespace SwiftParcel.Services.Deliveries.Application.Commands.Handlers
{
    internal sealed class CompleteDeliveryHandler : ICommandHandler<CompleteDelivery>
    {
        private readonly IDeliveriesRepository _repository;
        private readonly IMessageBroker _messageBroker;
        private readonly IEventMapper _eventMapper;
        private readonly IDateTimeProvider _dateTimeProvider;

        public CompleteDeliveryHandler(IDeliveriesRepository repository, IMessageBroker messageBroker,
            IEventMapper eventMapper, IDateTimeProvider dateTimeProvider)
        {
            _repository = repository;
            _messageBroker = messageBroker;
            _eventMapper = eventMapper;
            _dateTimeProvider = dateTimeProvider;
        }

        public async Task HandleAsync(CompleteDelivery command)
        {
            var delivery = await _repository.GetAsync(command.DeliveryId);
            if (delivery is null)
            {
                throw new DeliveryNotFoundException(command.DeliveryId);
            }
            
            delivery.Complete(_dateTimeProvider.Now, command.DeliveryAttemptDate);
            await _repository.UpdateAsync(delivery);
            var events = _eventMapper.MapAll(delivery.Events);
            await _messageBroker.PublishAsync(events.ToArray());
        }
    }
}