namespace SwiftParcel.Services.Deliveries.Application.Exceptions
{
    public class UnauthorizedDeliveryAccessException : AppException
    {
        public override string Code { get; } = "unauthorized_delivery_access";
        public Guid DeliveryId { get; }
        public Guid CourierId { get; }

        public UnauthorizedDeliveryAccessException(Guid deliveryId, Guid courierId)
            : base($"Unauthorized access to delivery with id: '{deliveryId}' by customer with id: '{courierId}'.")
        {
            DeliveryId = deliveryId;
            CourierId = courierId;
        }
    }
}