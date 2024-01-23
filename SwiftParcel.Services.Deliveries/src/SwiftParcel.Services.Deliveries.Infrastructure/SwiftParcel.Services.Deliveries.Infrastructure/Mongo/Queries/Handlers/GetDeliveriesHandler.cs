using Convey.CQRS.Queries;
using Convey.Persistence.MongoDB;
using SwiftParcel.Services.Deliveries.Application;
using SwiftParcel.Services.Deliveries.Application.DTO;
using SwiftParcel.Services.Deliveries.Application.Queries;
using SwiftParcel.Services.Deliveries.Infrastructure.Mongo.Documents;

namespace SwiftParcel.Services.Deliveries.Infrastructure.Mongo.Queries.Handlers
{
    public class GetDeliveriesHandler: IQueryHandler<GetDeliveries, IEnumerable<DeliveryDto>>
    {
        private readonly IMongoRepository<DeliveryDocument, Guid> _repository;
        private readonly IAppContext _appContext;

        public GetDeliveriesHandler(IMongoRepository<DeliveryDocument, Guid> repository,
            IAppContext appContext)
        {
            _repository = repository;
            _appContext = appContext;
        }

        public async Task<IEnumerable<DeliveryDto>> HandleAsync(GetDeliveries query)
        {
            var identity = _appContext.Identity;
            if(identity.Id != query.CourierId)
            {
                return Enumerable.Empty<DeliveryDto>();
            }

            var documents = await _repository.FindAsync(d => d.CourierId == query.CourierId);

            return documents.Select(d => d.AsDto());
        }
    }
}