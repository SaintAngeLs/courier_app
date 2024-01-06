﻿

using SwiftParcel.ExternalAPI.Lecturer.Application.DTO;
using SwiftParcel.ExternalAPI.Lecturer.Core.Entities;

namespace SwiftParcel.ExternalAPI.Lecturer.Infrastructure.Mongo.Documents
{
    internal static class Extensions
    {
        public static InquiryOffer AsEntity(this InquiryOfferDocument document)
            => document is null? null : new InquiryOffer(
                document.Id,
                document.InquiryId,
                document.TotalPrice,
                document.ExpiringAt,
                document.PriceBreakDown
                );

        public static async Task<InquiryOffer> AsEntityAsync(this Task<InquiryOfferDocument> task)
            => (await task).AsEntity();

        public static InquiryOfferDocument AsDocument(this InquiryOffer entity)
            => new InquiryOfferDocument
            {
                Id = entity.ParcelId,
                InquiryId = entity.InquiryId,
                TotalPrice = entity.TotalPrice,
                ExpiringAt = entity.ExpiringAt,
                PriceBreakDown = entity.PriceBreakDown
            };
        
        public static async Task<InquiryOfferDocument> AsDocumentAsync(this Task<InquiryOffer> task)
            => (await task).AsDocument();

        public static List<PriceBreakDownItemDto> AsDto(this List<PriceBreakDownItem> entity)
        {
            var dto = new List<PriceBreakDownItemDto>();
            foreach (var item in entity)
            {
                dto.Add(new PriceBreakDownItemDto()
                {
                    Amount = item.Amount,
                    Currency = item.Currency,
                    Description = item.Description
                });
            }
            return dto;
        }

    }
}
