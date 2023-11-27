﻿using System;
using System.Linq;
using System.Threading.Tasks;
using Convey.Persistence.MongoDB;
using SwiftParcel.Services.Orders.Core.Entities;
using SwiftParcel.Services.Orders.Infrastructure.Mongo.Documents;

namespace SwiftParcel.Services.Orders.Infrastructure.Mongo.Repositories
{
    public class OrderMongoRepository : IOrderRepository
    {
        private readonly IMongoRepository<OrderDocument, Guid> _repository;

        public OrderMongoRepository(IMongoRepository<OrderDocument, Guid> repository)
        {
            _repository = repository;
        }

        public async Task<Order> GetAsync(Guid id)
        {
            var order = await _repository.GetAsync(o => o.Id == id);

            return order?.AsEntity();
        }

        public async Task<Order> GetAsync(Guid courierId, DateTime deliveryDate)
        {
            var order = await _repository.GetAsync(o => o.CourierId == courierId &&
                                                        o.DeliveryDate == deliveryDate.Date);

            return order?.AsEntity();
        }

        public async Task<Order> GetContainingParcelAsync(Guid parcelId)
        {
            var order = await _repository.GetAsync(o => o.Parcels.Any(p => p.Id == parcelId));

            return order?.AsEntity();
        }

        public Task AddAsync(Order order) => _repository.AddAsync(order.AsDocument());
        public Task UpdateAsync(Order order) => _repository.UpdateAsync(order.AsDocument());
        public Task DeleteAsync(Guid id) => _repository.DeleteAsync(id);
    }
}