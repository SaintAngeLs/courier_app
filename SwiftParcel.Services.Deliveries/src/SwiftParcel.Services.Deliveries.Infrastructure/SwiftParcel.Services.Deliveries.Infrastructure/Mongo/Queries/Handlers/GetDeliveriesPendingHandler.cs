using Convey.CQRS.Queries;
using Convey.Persistence.MongoDB;
using SwiftParcel.Services.Deliveries.Application;
using SwiftParcel.Services.Deliveries.Application.DTO;
using SwiftParcel.Services.Deliveries.Application.Queries;
using SwiftParcel.Services.Deliveries.Core.Entities;
using SwiftParcel.Services.Deliveries.Infrastructure.Mongo.Documents;


namespace SwiftParcel.Services.Deliveries.Infrastructure.Mongo.Queries.Handlers
{
    public class GetDeliveriesPendingHandler: IQueryHandler<GetDeliveriesPending, IEnumerable<DeliveryDto>>
    {
        private readonly IMongoRepository<DeliveryDocument, Guid> _repository;
        private readonly IAppContext _appContext;   

        public GetDeliveriesPendingHandler(IMongoRepository<DeliveryDocument, Guid> repository,
            IAppContext appContext)
        {
            _repository = repository;
            _appContext = appContext;
        }
        public async Task<IEnumerable<DeliveryDto>> HandleAsync(GetDeliveriesPending query)
        {
            var identity = _appContext.Identity;
            if(!identity.IsCourier && !identity.IsOfficeWorker)
            {
                return Enumerable.Empty<DeliveryDto>();
            }

            var documents = await _repository.FindAsync(d => d.Status == DeliveryStatus.Unassigned);

            return documents.Select(d => d.AsDto());
        }
    }
}