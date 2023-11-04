using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Convey.CQRS.Events;
using Convey.MessageBrokers;
using Convey.MessageBrokers.Outbox;

namespace SwiftParcel.Services.Identity.Infrastructure.Decorators
{
    public class OutboxEventHandlerDecorator<TEvent> : IEventHandler<TEvent>
        where TEvent : class, IEvent
    {
        private readonly IEventHandler<TEvent> _handler;
        private readonly IMessageOutbox _outbox;
        private readonly string _messageId;
        private readonly bool _enabled;

        public OutboxEventHandlerDecorator(IEventHandler<TEvent> handler, IMessageOutbox outbox,
            OutboxOptions outboxOptions, IMessagePropertiesAccessor messagePropertiesAccessor)
        {
            _handler = handler;
            _outbox = outbox;
            _enabled = outboxOptions.Enabled;

            var messageProperties = messagePropertiesAccessor.MessageProperties;
            _messageId = string.IsNullOrWhiteSpace(messageProperties?.MessageId)
                ? Guid.NewGuid().ToString("N")
                : messageProperties.MessageId;
        }

        // public Task HandleAsync(TEvent @event)
        //     => _enabled
        //         ? _outbox.HandleAsync(_messageId, () => _handler.HandleAsync(@event))
        //         : _handler.HandleAsync(@event);

        public Task HandleAsync(TEvent @event, CancellationToken cancellationToken = default)
            => _enabled
                ? _outbox.HandleAsync(_messageId, () => _handler.HandleAsync(@event, cancellationToken))
                : _handler.HandleAsync(@event, cancellationToken);

        }
}