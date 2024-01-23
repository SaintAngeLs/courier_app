using System.Text.RegularExpressions;
using SwiftParcel.Services.Orders.Core.Exceptions;
using SwiftParcel.Services.Orders.Core.Events;

namespace SwiftParcel.Services.Orders.Core.Entities
{
    public class Order : AggregateRoot
    {
        public Guid? CustomerId { get; private set; }
        public Parcel Parcel { get; private set; }
        public OrderStatus Status { get; private set; }
        public Company CourierCompany { get; private set; }
        public DateTime OrderRequestDate { get; private set; }
        public DateTime RequestValidTo { get; private set;}
        public string BuyerName { get; private set; }
        public string BuyerEmail { get; private set; }
        public Address BuyerAddress { get; private set; }
        public DateTime? DecisionDate { get; private set; }
        public DateTime? PickedUpAt { get; private set; } 
        public DateTime? DeliveredAt { get; private set; }
        public DateTime? CannotDeliverAt { get; private set; }
        public string CancellationReason { get; private set; }
        public string CannotDeliverReason { get; private set; }
        public bool CanRequestDelivery => Status == OrderStatus.Approved;
        public bool CanBeDeleted => Status == OrderStatus.Cancelled;
        public bool HasParcel => Parcel != null;


        public Order(AggregateId id, Guid? customerId, OrderStatus status, DateTime createdAt,
            string buyerName, string buyerEmail, Address buyerAddress, DateTime? decisionDate,
            DateTime? pickedUpAt, DateTime? deliveredAt, DateTime? cannotDeliverAt, string cancellationReason,
            string cannotDeliverReason, Parcel parcel = null)
        {
            Id = id;
            CustomerId = customerId;
            Status = status;
            CourierCompany = Company.SwiftParcel;
            OrderRequestDate = createdAt;
            RequestValidTo = createdAt.AddHours(24);

            CheckBuyerName(buyerName);
            BuyerName = buyerName;
            CheckBuyerEmail(buyerEmail);
            BuyerEmail = buyerEmail;
            BuyerAddress = new Address();
            SetAddress(BuyerAddress, buyerAddress.Street, buyerAddress.BuildingNumber, buyerAddress.ApartmentNumber,
                buyerAddress.City, buyerAddress.ZipCode, buyerAddress.Country);

            Parcel = parcel;

            DecisionDate = decisionDate;
            PickedUpAt = pickedUpAt;
            DeliveredAt = deliveredAt;
            CannotDeliverAt = cannotDeliverAt;
            CancellationReason = cancellationReason;
            CannotDeliverReason = cannotDeliverReason;
        }

        public static Order Create(AggregateId id, Guid customerId, OrderStatus status, DateTime createdAt,
            string buyerName, string buyerEmail, Address buyerAddress)
        {
            var order = new Order(id, customerId == Guid.Empty ? null : customerId,
                        status, createdAt, buyerName, buyerEmail, buyerAddress, null, null, null,
                        null, string.Empty, string.Empty);
            order.AddEvent(new OrderStateChanged(order));

            return order;
        }

        public void AddParcel(Parcel parcel)
        {
            if (HasParcel)
            {
                throw new ParcelAlreadyAddedToOrderException(Id, parcel.Id);
            }
            Parcel = parcel;
            AddEvent(new ParcelAdded(this, parcel));
        }

        public void ApproveByOfficeWorker(DateTime decidedAt)
        {
            if (Status != OrderStatus.WaitingForDecision)
            {
                throw new CannotChangeOrderStateException(Id, Status, OrderStatus.Approved);
            }

            DecisionDate = decidedAt;
            Status = OrderStatus.Approved;
            CancellationReason = string.Empty;
            AddEvent(new OrderStateChanged(this));
        }

        public void CancelByOfficeWorker(DateTime decidedAt, string reason)
        {
            if (Status != OrderStatus.WaitingForDecision)
            {
                throw new CannotChangeOrderStateException(Id, Status, OrderStatus.Cancelled);
            }

            DecisionDate = decidedAt;
            Status = OrderStatus.Cancelled;
            CancellationReason = reason ?? string.Empty;
            AddEvent(new OrderStateChanged(this));
        }

        public void Confirm()
        {
            if (Status != OrderStatus.Approved)
            {
                throw new CannotChangeOrderStateException(Id, Status, OrderStatus.Confirmed);
            }

            Status = OrderStatus.Confirmed;
            AddEvent(new OrderStateChanged(this));
        }

        public void Cancel()
        {
            if (Status != OrderStatus.Approved)
            {
                throw new CannotChangeOrderStateException(Id, Status, OrderStatus.Cancelled);
            }

            Status = OrderStatus.Cancelled;
            AddEvent(new OrderStateChanged(this));
        }

        public void SetPickedUp(DateTime pickedUpAt)
        {
            if (Status != OrderStatus.Confirmed)
            {
                throw new CannotChangeOrderStateException(Id, Status, OrderStatus.PickedUp);
            }

            PickedUpAt = pickedUpAt;
            Status = OrderStatus.PickedUp;
            AddEvent(new OrderStateChanged(this));
        }

        public void Deliver(DateTime deliveredAt)
        {
            if (Status != OrderStatus.PickedUp)
            {
                throw new CannotChangeOrderStateException(Id, Status, OrderStatus.Delivered);
            }

            DeliveredAt = deliveredAt;
            Status = OrderStatus.Delivered;
            AddEvent(new OrderStateChanged(this));
        }
        
        public void SetCannotDeliver(string reason, DateTime cannotDeliverAt)
        {
            if (Status != OrderStatus.PickedUp)
            {
                throw new CannotChangeOrderStateException(Id, Status, OrderStatus.CannotDeliver);
            }

            CannotDeliverAt = cannotDeliverAt;
            Status = OrderStatus.CannotDeliver;
            CannotDeliverReason = reason ?? string.Empty;
            AddEvent(new OrderStateChanged(this));
        }
        
        public void AddCustomer(Guid customerId)
        {
            if(CustomerId != null)
            {
                throw new CustomerAlreadyAddedToOrderException(customerId, Id);
            }
            CustomerId = customerId;
        }
        public void CheckBuyerName(string name)
        {
            if (string.IsNullOrEmpty(name))
            {
                throw new InvalidBuyerNameException(name);
            }
        }
        public void CheckBuyerEmail(string email)
        {
            string pattern = @"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$";
            if (!Regex.IsMatch(email, pattern))
            {
                throw new InvalidBuyerEmailException(email);
            }
        }

        private void SetAddress(Address address, string street, string buildingNumber, string apartmentNumber,
            string city, string zipCode, string country)
        {
            CheckAddressElement("street", street);
            address.Street = street;

            CheckAddressElement("building number", buildingNumber);
            address.BuildingNumber = buildingNumber;

            CheckAddressApartmentNumber("apartment number", ref apartmentNumber);
            address.ApartmentNumber = apartmentNumber;

            CheckAddressElement("city", city);
            address.City = city;

            CheckAddressZipCode("zip code", zipCode);
            address.ZipCode = zipCode;

            CheckAddressElement("country", country);
            address.Country = country;
        }

        public void CheckAddressElement(string element, string value)
        {
            if (string.IsNullOrEmpty(value))
            {
                throw new InvalidAddressElementException(element, value);
            }
        }

        public void CheckAddressApartmentNumber(string element, ref string value)
        {
            if (string.IsNullOrEmpty(value))
            {
                value = string.Empty;
            }
        }

        public void CheckAddressZipCode(string element, string value)
        {
            string pattern = @"\d{2}[-]\d{3}";
            if (!Regex.IsMatch(value, pattern))
            {
                throw new InvalidAddressElementException(element, value);
            }
        }
    }
}

