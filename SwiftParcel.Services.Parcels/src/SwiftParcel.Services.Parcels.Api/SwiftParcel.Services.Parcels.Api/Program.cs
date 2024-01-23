using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore;
using Convey;
using Convey.Secrets.Vault;
using Convey.Logging;
using Convey.Types;
using Convey.WebApi;
using Convey.WebApi.CQRS;
using SwiftParcel.Services.Parcels.Application;
using SwiftParcel.Services.Parcels.Application.Queries;
using SwiftParcel.Services.Parcels.Application.DTO;
using SwiftParcel.Services.Parcels.Application.Commands;
using SwiftParcel.Services.Parcels.Infrastructure;
using Convey.Docs.Swagger;

namespace SwiftParcel.Services.Parcels.Api
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
                    .UseSwagger()
                    .UseSwaggerUI()
                    .UseInfrastructure()
                    .UseDispatcherEndpoints(endpoints => endpoints
                        .Get("", ctx => ctx.Response.WriteAsync(ctx.RequestServices.GetService<AppOptions>().Name))
                        .Get<GetParcels, IEnumerable<ParcelDto>>("parcels")
                        .Get<GetParcelsOfficeWorker, IEnumerable<ParcelDto>>("parcels/office-worker")
                        .Get<GetParcel, ParcelDto>("parcels/{parcelId}")
                        .Get<GetOffers, IEnumerable<ExpirationStatusDto>>("parcels/{parcelId}/offers")
                        .Post<AddParcel>("parcels",
                            afterDispatch: (cmd, ctx) => ctx.Response.Created($"parcels/{cmd.ParcelId}/offers", cmd.ParcelId))
                        .Delete<DeleteParcel>("parcels/{parcelId}")
                    ))
                .UseLogging()
                .UseVault()
                .Build()
                .RunAsync();
    }
}