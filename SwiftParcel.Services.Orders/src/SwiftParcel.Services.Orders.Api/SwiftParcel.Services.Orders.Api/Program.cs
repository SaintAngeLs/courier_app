using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore;
using Convey;
using Convey.WebApi;
using Convey.WebApi.CQRS;
using Convey.Types;
using Convey.CQRS.Queries;
using Convey.Logging;
using Convey.Secrets.Vault;
using SwiftParcel.Services.Orders.Infrastructure;
using SwiftParcel.Services.Orders.Application;
using SwiftParcel.Services.Orders.Application.DTO;
using SwiftParcel.Services.Orders.Application.Queries;
using SwiftParcel.Services.Orders.Application.Commands;

namespace SwiftParcel.Services.Orders.Api
{
    public class Program
    {
        public static async Task Main(string[] args)
            => await WebHost.CreateDefaultBuilder(args)
                .ConfigureServices(services => services
                    .AddConvey()
                    .AddWebApi()
                    .AddApplication()
                    .AddInfrastructure()
                    .Build())
                .Configure(app => app
                    .UseInfrastructure()
                    .UseDispatcherEndpoints(endpoints => endpoints
                        .Get("", ctx => ctx.Response.WriteAsync(ctx.RequestServices.GetService<AppOptions>().Name))
                        .Get<GetOrder, OrderDto>("orders/{orderId}")
                        .Get<GetOrders, IEnumerable<OrderDto>>("orders")
                        .Get<GetOrdersRequests, IEnumerable<OrderDto>>("orders/requests")
                        .Get<GetOrdersOfficeWorker, IEnumerable<OrderDto>>("orders/office-worker")
                        .Get<GetOrdersOfficeWorkerPending, IEnumerable<OrderDto>>("orders/office-worker/pending")
                        .Get<GetOrderStatus, OrderStatusDto>("orders/{orderId}/status")
                        .Delete<DeleteOrder>("orders/{orderId}")
                        .Post<CreateOrder>("orders",
                            afterDispatch: (cmd, ctx) => ctx.Response.Created($"orders/{cmd.OrderId}/status", cmd.OrderId))
                        .Post<AddCustomerToOrder>("orders/{orderId}/customer",
                            afterDispatch: (cmd, ctx) => ctx.Response.Created($"orders/{cmd.OrderId}"))
                        .Put<ApproveOrderOfficeWorker>("orders/{orderId}/office-worker/approve")
                        .Put<CancelOrderOfficeWorker> ("orders/{orderId}/office-worker/cancel")
                        .Post<ConfirmOrder>("orders/{orderId}/confirm")
                        .Delete<CancelOrder>("orders/{orderId}/cancel")))
                .UseLogging()
                .UseVault()
                .Build()
                .RunAsync();
    }
}
