using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Convey.CQRS.Commands;
using Convey.MessageBrokers;
using Convey.MessageBrokers.Outbox;

namespace SwiftParcel.Services.Identity.Infrastructure.Decorators
{
    public class OutboxCommandHandlerDecorator<TCommand> : ICommandHandler<TCommand>
        where TCommand : class, ICommand
    {
        private readonly ICommandHandler<TCommand> _handler;
        private readonly IMessageOutbox _outbox;
        private readonly string _messageId;
        private readonly bool _enabled;

        public OutboxCommandHandlerDecorator(ICommandHandler<TCommand> handler, IMessageOutbox outbox,
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

        // public Task HandleAsync(TCommand command)
        //     => _enabled
        //         ? _outbox.HandleAsync(_messageId, () => _handler.HandleAsync(command))
        //         : _handler.HandleAsync(command);

        public Task HandleAsync(TCommand command, CancellationToken cancellationToken = default)
        => _enabled
            ? _outbox.HandleAsync(_messageId, () => _handler.HandleAsync(command, cancellationToken))
            : _handler.HandleAsync(command, cancellationToken);

    }
}