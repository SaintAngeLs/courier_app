using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Convey.CQRS.Commands;
using OpenTracing;
using OpenTracing.Tag;

namespace SwiftParcel.Services.Availability.Infrastructure.Jeager
{
    public class JaegerCommandHandlerDecorator<TCommand> : ICommandHandler<TCommand>
        where TCommand : class, ICommand
    {
        private readonly ICommandHandler<TCommand> _handler;
        private readonly ITracer _tracer;

        public JaegerCommandHandlerDecorator(ICommandHandler<TCommand> handler, ITracer tracer)
        {
            _handler = handler;
            _tracer = tracer;
        }

        public async Task HandleAsync(TCommand command, CancellationToken cancellationToken)
        {
            var commandName = ToUnderscoreCase(command.GetType().Name);
            using var scope = BuildScope(commandName);
            var span = scope.Span;

            try
            {
                span.Log($"Handling a message: {commandName}");
                await _handler.HandleAsync(command);
                span.Log($"Handled a message: {commandName}");
            }
            catch (Exception ex)
            {
                span.Log(ex.Message);
                span.SetTag(Tags.Error, true);
                throw;
            }
        }

        private IScope BuildScope(string commandName)
        {
            var scope = _tracer
                .BuildSpan($"handling-{commandName}")
                .WithTag("message-type", commandName);

            if (_tracer.ActiveSpan is {})
            {
                scope.AddReference(References.ChildOf, _tracer.ActiveSpan.Context);
            }

            return scope.StartActive(true);
        }

        private static string ToUnderscoreCase(string str)
            => string.Concat(str.Select((x, i) => i > 0 && char.IsUpper(x) ? "_" + x : x.ToString()))
                .ToLowerInvariant();
    }
}