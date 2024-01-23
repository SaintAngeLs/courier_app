using System.Linq;
using SwiftParcel.Services.Orders.Application.DTO;
using SwiftParcel.Services.Orders.Core.Entities;

namespace SwiftParcel.Services.Orders.Infrastructure.Mongo.Documents
{
    public static class Extensions
    {
        public static Order AsEntity(this OrderDocument document)
            => new Order(document.Id, document.CustomerId, document.Status, document.OrderRequestDate,
                document.BuyerName, document.BuyerEmail, document.BuyerAddress, 
                document.DecisionDate, document.PickedUpAt, document.DeliveredAt, document.CannotDeliverAt, 
                document.CancellationReason, document.CannotDeliverReason, document.Parcel);

        public static OrderDocument AsDocument(this Order entity)
            => new OrderDocument
            {
                Id = entity.Id,
                CustomerId = entity.CustomerId,
                Parcel = entity.Parcel,
                Status = entity.Status,
                CourierCompany = entity.CourierCompany,
                OrderRequestDate = entity.OrderRequestDate,
                RequestValidTo = entity.RequestValidTo,
                BuyerName = entity.BuyerName,
                BuyerEmail = entity.BuyerEmail,
                BuyerAddress = entity.BuyerAddress,
                DecisionDate = entity.DecisionDate,
                PickedUpAt = entity.PickedUpAt,
                DeliveredAt = entity.DeliveredAt,
                CannotDeliverAt = entity.CannotDeliverAt,
                CancellationReason = entity.CancellationReason,
                CannotDeliverReason = entity.CannotDeliverReason,
            };

        public static OrderDto AsDto(this OrderDocument document)
            => new OrderDto
            {
                Id = document.Id,
                CustomerId = document.CustomerId,
                Parcel = new ParcelDto(document.Parcel),
                Status = document.Status.ToString().ToLowerInvariant(),
                CourierCompany = document.CourierCompany.ToString(),
                OrderRequestDate = document.OrderRequestDate,
                RequestValidTo = document.RequestValidTo,
                BuyerName = document.BuyerName,
                BuyerEmail = document.BuyerEmail,
                BuyerAddress = new AddressDto(document.BuyerAddress.Street, document.BuyerAddress.BuildingNumber,
                    document.BuyerAddress.ApartmentNumber, document.BuyerAddress.City, document.BuyerAddress.ZipCode,
                    document.BuyerAddress.Country),
                DecisionDate = document.DecisionDate,
                PickedUpAt = document.PickedUpAt,
                DeliveredAt = document.DeliveredAt,
                CannotDeliverAt = document.CannotDeliverAt,
                CancellationReason = document.CancellationReason,
                CannotDeliverReason = document.CannotDeliverReason
            };
        
        public static Customer AsEntity(this CustomerDocument document)
            => new Customer(document.Id, document.Email, document.FullName);

        public static CustomerDocument AsDocument(this Customer entity)
            => new CustomerDocument
            {
                Id = entity.Id,
                Email = entity.Email,
                FullName = entity.FullName
            };
    }
}