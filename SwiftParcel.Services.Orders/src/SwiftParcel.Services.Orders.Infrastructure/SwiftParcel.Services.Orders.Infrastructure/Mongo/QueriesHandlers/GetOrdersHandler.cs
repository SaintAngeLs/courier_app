using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Convey.CQRS.Queries;
using Convey.Persistence.MongoDB;
using MongoDB.Driver;
using MongoDB.Driver.Linq;
using SwiftParcel.Services.Orders.Application;
using SwiftParcel.Services.Orders.Application.DTO;
using SwiftParcel.Services.Orders.Application.Queries;
using SwiftParcel.Services.Orders.Infrastructure.Mongo.Documents;
using SwiftParcel.Services.Orders.Core.Entities;
using SwiftParcel.Services.Orders.Application.Services.Clients;

namespace SwiftParcel.Services.Orders.Infrastructure.Mongo.QueriesHandlers
{
    public class GetOrdersHandler : IQueryHandler<GetOrders, IEnumerable<OrderDto>>
    {
        private readonly IMongoRepository<OrderDocument, Guid> _orderRepository;
        private readonly ILecturerApiServiceClient _lecturerApiServiceClient;
        private readonly IAppContext _appContext;

        public GetOrdersHandler(IMongoRepository<OrderDocument, Guid> orderRepository, 
            ILecturerApiServiceClient lecturerApiServiceClient, IAppContext appContext)
        {
            _orderRepository = orderRepository;
            _lecturerApiServiceClient = lecturerApiServiceClient;
            _appContext = appContext;
        }

        public async Task<IEnumerable<OrderDto>> HandleAsync(GetOrders query, CancellationToken cancellationToken)
        {
            var documents = _orderRepository.Collection.AsQueryable();
            var identity = _appContext.Identity;
            if (identity.IsAuthenticated && identity.Id != query.CustomerId && !identity.IsOfficeWorker)
            {
                return Enumerable.Empty<OrderDto>();
            }

            documents = documents.Where(p => p.CustomerId == query.CustomerId);
            var orders = await documents.ToListAsync();
            var ordersDto = orders.Select(p => p.AsDto());

            var miniCurrierOrders = await _lecturerApiServiceClient.GetOrdersAsync(query.CustomerId.ToString());
            ordersDto = ordersDto.Concat(miniCurrierOrders);

            return ordersDto;
        }
    }
}