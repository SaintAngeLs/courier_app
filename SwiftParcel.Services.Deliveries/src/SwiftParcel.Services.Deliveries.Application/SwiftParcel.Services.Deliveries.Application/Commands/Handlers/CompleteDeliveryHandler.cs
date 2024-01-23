using Convey.CQRS.Commands;
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
        private readonly IAppContext _appContext;

        public CompleteDeliveryHandler(IDeliveriesRepository repository, IMessageBroker messageBroker,
            IEventMapper eventMapper, IDateTimeProvider dateTimeProvider, IAppContext appContext)
        {
            _repository = repository;
            _messageBroker = messageBroker;
            _eventMapper = eventMapper;
            _dateTimeProvider = dateTimeProvider;
            _appContext = appContext;
        }

        public async Task HandleAsync(CompleteDelivery command)
        {
            var delivery = await _repository.GetAsync(command.DeliveryId);
            if (delivery is null)
            {
                throw new DeliveryNotFoundException(command.DeliveryId);
            }
            var identity = _appContext.Identity;
            if (delivery.CourierId != identity.Id)
            {
                throw new UnauthorizedDeliveryAccessException(command.DeliveryId, identity.Id);
            }
            
            delivery.Complete(_dateTimeProvider.Now, command.DeliveryAttemptDate);
            await _repository.UpdateAsync(delivery);
            var events = _eventMapper.MapAll(delivery.Events);
            await _messageBroker.PublishAsync(events.ToArray());
        }
    }
}