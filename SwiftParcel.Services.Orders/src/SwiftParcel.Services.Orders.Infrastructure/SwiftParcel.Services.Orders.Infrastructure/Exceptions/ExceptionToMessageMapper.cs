﻿using System;
using Convey.MessageBrokers.RabbitMQ;
using SwiftParcel.Services.Orders.Application.Commands;
using SwiftParcel.Services.Orders.Application.Exceptions;
using SwiftParcel.Services.Orders.Application.Events.Rejected;
using SwiftParcel.Services.Orders.Application.Events.External;
using SwiftParcel.Services.Orders.Core.Exceptions;


namespace SwiftParcel.Services.Orders.Infrastructure.Exceptions
{
    public class ExceptionToMessageMapper : IExceptionToMessageMapper
    {
        public object Map(Exception exception, object message)
            => exception switch
            {
                CannotDeleteOrderException ex => (object) new DeleteOrderRejected(ex.Id, ex.Message, ex.Code),
                CustomerNotFoundException ex => new CreateOrderRejected(ex.Id, ex.Message, ex.Code),
                OrderForReservedCourierNotFoundException ex => new OrderForReservedVehicleNotFound(ex.CourierId,
                    ex.Date, ex.Message, ex.Code),

                OrderNotFoundException ex
                => message switch
                {
                    AddParcelToOrder m => (object) new AddParcelToOrderRejected(m.OrderId, m.ParcelId, ex.Message,
                        ex.Code),
                    ApproveOrder m => new ApproveOrderRejected(m.OrderId, ex.Message, ex.Code),
                    AssignCourierToOrder m => new AssignCourierToOrderRejected(m.OrderId, m.CourierId, ex.Message,
                        ex.Code),
                    CancelOrder m => new CancelOrderRejected(m.OrderId, ex.Message, ex.Code),
                    DeleteOrder m => new DeleteOrderRejected(m.OrderId, ex.Message, ex.Code),
                    DeleteParcelFromOrder m => new DeleteParcelFromOrderRejected(m.OrderId, m.ParcelId, ex.Message,
                        ex.Code),
                    DeliveryCompleted _ => new OrderForDeliveryNotFound(ex.Id, ex.Message, ex.Code),
                    DeliveryFailed _ => new OrderForDeliveryNotFound(ex.Id, ex.Message, ex.Code),
                    DeliveryStarted _ => new OrderForDeliveryNotFound(ex.Id, ex.Message, ex.Code),
                    _ => null
                },

                OrderHasNoParcelsException ex
                => message switch
                {
                    AddParcelToOrder m => new AssignCourierToOrderRejected(m.OrderId, m.ParcelId, ex.Message, ex.Code),
                    _ => null
                },

                OrderParcelNotFoundException ex
                => message switch
                {
                    AddParcelToOrder m => new AddParcelToOrderRejected(m.OrderId, m.ParcelId, ex.Message, ex.Code),
                    _ => null
                },

                ParcelNotFoundException ex
                => message switch
                {
                    AddParcelToOrder m => new AddParcelToOrderRejected(m.OrderId, m.ParcelId, ex.Message, ex.Code),
                    _ => null
                },

                ParcelAlreadyAddedToOrderException ex => new AddParcelToOrderRejected(ex.OrderId, ex.ParcelId,
                    ex.Message, ex.Code),

                UnauthorizedOrderAccessException ex
                => message switch
                {
                    AddParcelToOrder m => (object) new AddParcelToOrderRejected(m.OrderId, m.ParcelId, ex.Message,
                        ex.Code),
                    AssignCourierToOrder m => new AssignCourierToOrderRejected(m.OrderId, m.CourierId, ex.Message,
                        ex.Code),
                    DeleteOrder m => new DeleteOrderRejected(m.OrderId, ex.Message, ex.Code),
                    DeleteParcelFromOrder m => new DeleteParcelFromOrderRejected(m.OrderId, m.ParcelId, ex.Message,
                        ex.Code),
                    _ => null
                },
                CourierNotFoundException ex
                => message switch
                {
                    AssignCourierToOrder m => new AssignCourierToOrderRejected(m.OrderId, m.CourierId, ex.Message,
                        ex.Code),
                    _ => null,
                },
                _ => null,
            };
    }
}