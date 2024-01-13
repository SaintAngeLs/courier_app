﻿using Convey.CQRS.Commands;
using SwiftParcel.Services.Orders.Application.Services;
using SwiftParcel.Services.Orders.Core.Repositories;
using SwiftParcel.Services.Orders.Application.Exceptions;

namespace SwiftParcel.Services.Orders.Application.Commands.Handlers
{
    public class CancelOrderSwiftParcelHandler: ICommandHandler<CancelOrderSwiftParcel>
    {
        private readonly IOrderRepository _orderRepository;
        private readonly IMessageBroker _messageBroker;
        private readonly IEventMapper _eventMapper;
        private readonly IAppContext _appContext;
        private readonly IDateTimeProvider _dateTimeProvider;
        public CancelOrderSwiftParcelHandler(IOrderRepository orderRepository, IMessageBroker messageBroker,
            IEventMapper eventMapper, IAppContext appContext, IDateTimeProvider dateTimeProvider)
        {
            _orderRepository = orderRepository;
            _messageBroker = messageBroker;
            _eventMapper = eventMapper;
            _appContext = appContext;
            _dateTimeProvider = dateTimeProvider;
        }

        public async Task HandleAsync(CancelOrderSwiftParcel command, CancellationToken cancellationToken)
        {
            var order = await _orderRepository.GetAsync(command.OrderId);
            if (order is null)
            {
                throw new OrderNotFoundException(command.OrderId);
            }

            var identity = _appContext.Identity;
            if (identity.IsAuthenticated && identity.Id != order.CustomerId)
            {
                throw new UnauthorizedOrderAccessException(command.OrderId, identity.Id);
            }

            if(order.RequestValidTo < _dateTimeProvider.Now)
            {
                throw new OrderRequestExpiredException(command.OrderId, order.RequestValidTo);
            }
            
            order.Cancel();
            await _orderRepository.DeleteAsync(order.Id);
            var events = _eventMapper.MapAll(order.Events);
            await _messageBroker.PublishAsync(events.ToArray());
        }
    }
}