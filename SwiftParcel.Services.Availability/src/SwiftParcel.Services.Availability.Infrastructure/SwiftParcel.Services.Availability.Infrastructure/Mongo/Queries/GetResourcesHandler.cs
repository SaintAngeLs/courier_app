using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Convey.CQRS.Queries;
using MongoDB.Driver;
using SwiftParcel.Services.Availability.Application.DTO;
using SwiftParcel.Services.Availability.Application.Qeries;
using SwiftParcel.Services.Availability.Infrastructure.Mongo.Documents;

namespace SwiftParcel.Services.Availability.Infrastructure.Mongo.Queries
{
    public class GetResourcesHandler: IQueryHandler<GetResources, IEnumerable<ResourceDto>>
    {
        private readonly IMongoDatabase _database;

        public GetResourcesHandler(IMongoDatabase database)
        {
            _database = database;
        }

        public async Task<IEnumerable<ResourceDto>> HandleAsync(GetResources query, CancellationToken cancellationToken)
        {
            var collection = _database.GetCollection<ResourceDocument>("resources");

            if (query.Tags is null || !query.Tags.Any())
            {
                var allDocuments = await collection.Find(_ => true).ToListAsync();

                return allDocuments.Select(d => d.AsDto());
            }

            var documents = collection.AsQueryable();
            documents = (MongoDB.Driver.Linq.IMongoQueryable<ResourceDocument>)(query.MatchAllTags
                ? documents.Where(d => query.Tags.All(t => d.Tags.Contains(t)))
                : documents.Where(d => query.Tags.Any(t => d.Tags.Contains(t))));

            var resources = await documents.ToListAsync();

            return resources.Select(d => d.AsDto());
        }
    }
}