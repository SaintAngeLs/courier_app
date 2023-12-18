﻿namespace SwiftParcel.Services.Parcels.Application.DTO
{
    public class ExpirationStatusDto
    {
        public Guid ParcelId { get; set; } 
        public decimal TotalPrice { get; set; }
        public DateTime ExpiringAt { get; set; }
    }
}