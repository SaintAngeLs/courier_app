using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Text.RegularExpressions;
using System.Globalization;
using System.Threading.Tasks;
using SwiftParcel.Services.Parcels.Core.Exceptions;

namespace SwiftParcel.Services.Parcels.Core.Entities
{
    public class Parcel
    {
        public Guid Id { get; protected set; }
        public Guid? CustomerId { get; protected set; }  
        public string Description { get; protected set; }
        public double Width { get; protected set; }
        public double Height { get; protected set; }
        public double Depth { get; protected set; }
        public double Weight { get; protected set; }
        public Address Source { get; protected set; }
        public Address Destination { get; protected set; }
        public Priority Priority { get; protected set; }
        public bool AtWeekend { get; protected set; }
        public DateTime PickupDate { get; protected set; }
        public DateTime DeliveryDate { get; protected set; }
        public bool IsCompany { get; protected set; }
        public bool VipPackage { get; protected set; }
        public DateTime CreatedAt { get; protected set; }
        public DateTime ValidTo { get; protected set; }
        public decimal CalculatedPrice { get; protected set; }
        public List<PriceBreakDownItem> PriceBreakDown { get; protected set; }

        public Parcel(AggregateId id, string description, double width,
            double height, double depth, double weight, Priority priority, bool atWeekend,
            DateTime pickupDate, DateTime deliveryDate, bool isCompany, bool vipPackage,
            DateTime createdAt, decimal calculatedPrice, List<PriceBreakDownItem> priceBreakDown,
            DateTime validTo, Guid? customerId)
            : this(id, description, width, height, depth, weight, new Address(), new Address(),
             priority, atWeekend, pickupDate, deliveryDate, isCompany, vipPackage, createdAt, 
             calculatedPrice, priceBreakDown, validTo, customerId)
        {

        }

        public Parcel(AggregateId id, string description, double width, double height,
            double depth, double weight, Address source, Address destination,
            Priority priority, bool atWeekend, DateTime pickupDate, DateTime deliveryDate, bool isCompany, bool vipPackage,
             DateTime createdAt, decimal calculatedPrice, List<PriceBreakDownItem> priceBreakDown, 
             DateTime validTo, Guid? customerId)
        {
            Id = id;
            CustomerId = customerId;

            CheckDescription(description);
            Description = description;
            
            CheckDimensions(width, height, depth);
            Width = width;
            Height = height;
            Depth = depth;
            
            CheckWeight(weight);
            Weight = weight;
                        
            Source = source;
            Destination = destination;
            Priority = priority;
            AtWeekend = atWeekend;
            CheckPickupDate(pickupDate, createdAt);
            PickupDate = pickupDate;
            CheckDeliveryDate(deliveryDate, pickupDate);
            DeliveryDate = deliveryDate;
            IsCompany = isCompany;
            VipPackage = vipPackage;
            CreatedAt = createdAt;
            ValidTo = validTo;
            CalculatedPrice = calculatedPrice;
            PriceBreakDown = priceBreakDown;
        }

        public void CheckDescription(string description)
        {
            if (string.IsNullOrEmpty(description))
            {
                throw new InvalidParcelDescriptionException(description);
            }
        }

        public void CheckDimensions(double width, double height, double depth)
        {
            if (width < 0.2 || width >= 8)
            {
                throw new InvalidParcelDimensionException("width", width);
            }

            if (height < 0.2 || height >= 8)
            {
                throw new InvalidParcelDimensionException("height", height);
            }

            if (depth < 0.2 || depth >= 8)
            {
                throw new InvalidParcelDimensionException("depth", depth);
            }
        }

        public void CheckWeight(double weight)
        {
            if (weight < 0.1 || weight > 100)
            {
                throw new InvalidParcelWeightException(weight);
            }
        }

        public void CheckPrice(decimal price)
        {
            if (price <= 0)
            {
                throw new InvalidParcelPriceException(price);
            }
        }

        public void CheckPickupDate(DateTime pickupDate, DateTime now)
        {
            if (pickupDate <= now)
            {
                throw new InvalidParcelPickupDateException(pickupDate, now);
            }
        }

        public void CheckDeliveryDate(DateTime deliveryDate, DateTime pickupDate)
        {
            if (deliveryDate <= pickupDate)
            {
                throw new InvalidParcelDeliveryDateException(deliveryDate, pickupDate);
            }
        }

        public void SetCalculatedPrice(decimal price)
        {
            CheckPrice(price);
            CalculatedPrice = price;
        }

        public void SetSourceAddress(string street, string buildingNumber, string apartmentNumber, string city, string zipCode, string country)
        {
            SetAddress(Source, street, buildingNumber, apartmentNumber, city, zipCode, country);
        }

        public void SetDestinationAddress(string street, string buildingNumber, string apartmentNumber, string city, string zipCode, string country)
        {
            SetAddress(Destination, street, buildingNumber, apartmentNumber, city, zipCode, country);
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
        public void SetPriority(Priority priority) => Priority = priority;

        public void SetAtWeekend(bool atWeekend) => AtWeekend = atWeekend;

        public void SetIsCompany(bool isCompany) => IsCompany = isCompany;

        public void SetVipPackage(bool vipPackage) => VipPackage = vipPackage;
    }
}
