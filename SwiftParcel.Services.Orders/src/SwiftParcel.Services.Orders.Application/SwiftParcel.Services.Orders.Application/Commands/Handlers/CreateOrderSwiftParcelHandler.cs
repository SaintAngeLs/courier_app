﻿using Convey.CQRS.Commands;
using SwiftParcel.Services.Orders.Application.Services;
using SwiftParcel.Services.Orders.Core.Entities;
using SwiftParcel.Services.Orders.Core.Repositories;
using SwiftParcel.Services.Orders.Core.Exceptions;
using SwiftParcel.Services.Orders.Application.Services.Clients;
using SwiftParcel.Services.Orders.Application.Exceptions;

namespace SwiftParcel.Services.Orders.Application.Commands.Handlers
{
    public class CreateOrderSwiftParcelHandler : ICommandHandler<CreateOrderSwiftParcel>
    {
        private readonly IOrderRepository _orderRepository;
        private readonly ICustomerRepository _customerRepository;
        private readonly IMessageBroker _messageBroker;
        private readonly IEventMapper _eventMapper;
        private readonly IDateTimeProvider _dateTimeProvider;
        private readonly IParcelsServiceClient _parcelsServiceClient;

        public CreateOrderSwiftParcelHandler(IOrderRepository orderRepository, ICustomerRepository customerRepository,
            IMessageBroker messageBroker, IEventMapper eventMapper, IDateTimeProvider dateTimeProvider, 
             IParcelsServiceClient parcelsServiceClient)
        {
            _orderRepository = orderRepository;
            _customerRepository = customerRepository;
            _messageBroker = messageBroker;
            _eventMapper = eventMapper;
            _dateTimeProvider = dateTimeProvider;
            _parcelsServiceClient = parcelsServiceClient;
        }

        public async Task HandleAsync(CreateOrderSwiftParcel command, CancellationToken cancellationToken)
        {
            var parcelDto = await _parcelsServiceClient.GetAsync(command.ParcelId);
            if (parcelDto is null)
            {
                throw new ParcelNotFoundException(command.ParcelId);
            }
            var parcel = new Parcel(command.ParcelId, parcelDto.Description, 
                            parcelDto.Width, parcelDto.Height, parcelDto.Depth, parcelDto.Weight, parcelDto.Source.AsEntity(),
                            parcelDto.Destination.AsEntity(), parcelDto.Priority, parcelDto.AtWeekend, parcelDto.PickupDate, 
                            parcelDto.DeliveryDate, parcelDto.IsCompany, parcelDto.VipPackage, parcelDto.CreatedAt, 
                            parcelDto.ValidTo, parcelDto.CalculatedPrice, 
                            parcelDto.PriceBreakDown.Select(x => new PriceBreakDownItem(x.Amount, x.Currency, x.Description)).ToList());
            var requestDate = _dateTimeProvider.Now;
            parcel.ValidateRequest(requestDate);

            var order = Order.Create(command.OrderId, command.CustomerId, OrderStatus.WaitingForDecision, requestDate,
                command.Name, command.Email, command.Address);
            order.AddParcel(parcel);

            await _orderRepository.AddAsync(order);
            var events = _eventMapper.MapAll(order.Events);
            await _messageBroker.PublishAsync(events.ToArray());
        }
    }
}