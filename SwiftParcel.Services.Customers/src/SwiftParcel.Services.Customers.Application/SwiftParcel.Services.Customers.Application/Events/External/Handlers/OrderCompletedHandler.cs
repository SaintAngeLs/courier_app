using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Convey.CQRS.Events;
using SwiftParcel.Services.Customers.Core.Exceptions;
using SwiftParcel.Services.Customers.Core.Repositories;
using SwiftParcel.Services.Customers.Core.Services;

namespace SwiftParcel.Services.Customers.Application.Events.External.Handlers
{
    public class OrderCompletedHandler : IEventHandler<OrderCompleted>
    {
        private readonly ICustomerRepository _customerRepository;
        private readonly IVipPolicy _vipPolicy;
        private readonly IEventMapper _eventMapper;
        private readonly IMessageBroker _messageBroker;

        public OrderCompletedHandler(ICustomerRepository customerRepository, IVipPolicy vipPolicy,
            IEventMapper eventMapper, IMessageBroker messageBroker)
        {
            _customerRepository = customerRepository;
            _vipPolicy = vipPolicy;
            _eventMapper = eventMapper;
            _messageBroker = messageBroker;
        }

        public async Task HandleAsync(OrderCompleted @event, CancellationToken cancellationToken)
        {
            var customer = await _customerRepository.GetAsync(@event.CustomerId);
            if (customer is null)
            {
                throw new CustomerNotFoundException(@event.CustomerId);
            }

            var isVip = customer.IsVip;
            customer.AddCompletedOrder(@event.OrderId);
            _vipPolicy.ApplyVipStatusIfEligible(customer);
            var vipApplied = !isVip && customer.IsVip;
            await _customerRepository.UpdateAsync(customer);
            var events = _eventMapper.MapAll(customer.Events);
            await _messageBroker.PublishAsync(events.ToArray());
        }
    }
}