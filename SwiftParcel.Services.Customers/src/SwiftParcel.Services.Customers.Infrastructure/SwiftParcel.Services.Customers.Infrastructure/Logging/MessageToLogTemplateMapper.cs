using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Convey.Logging.CQRS;
using SwiftParcel.Services.Customers.Application.Commands;
using SwiftParcel.Services.Customers.Application.Events.External;
using SwiftParcel.Services.Customers.Application.Events.External.Handlers;

namespace SwiftParcel.Services.Customers.Infrastructure.Logging
{
    public class MessageToLogTemplateMapper : IMessageToLogTemplateMapper
    {
        private static IReadOnlyDictionary<Type, HandlerLogTemplate> MessageTemplates
            => new Dictionary<Type, HandlerLogTemplate>
            {
                {
                    typeof(CompleteCustomerRegistration),
                    new HandlerLogTemplate {After = "Completed a registration for the customer with id: {CustomerId}."}
                },
                {
                    typeof(ChangeCustomerState),
                    new HandlerLogTemplate {After = "Changed a customer with id: {CustomerId} state to: {State}."}
                },
                {
                    typeof(OrderCompleted), new HandlerLogTemplate
                    {
                        After = "Order with id: {OrderId} for the customer with id: {CustomerId} has been completed."
                    }
                },
                {
                    typeof(SignedUp), new HandlerLogTemplate
                    {
                        After = "Created a new customer with id: {UserId}."
                    }
                }
            };

        public HandlerLogTemplate Map<TMessage>(TMessage message) where TMessage : class
        {
            var key = message.GetType();
            return MessageTemplates.TryGetValue(key, out var template) ? template : null;
        }
}