using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SwiftParcel.Services.Availability.Infrastructure.Services
{
    internal sealed class EventMapper: IEventMapper
    {
        public IEnumerable<IEvent> MapAll(IEnumerable<IDomainEvent> events)
            => events.Select(Map);

        public IEvent Map(IDomainEvent @event)
            => @event switch
            {
                ResourceCreated e => (IEvent) new ResourceAdded(e.Resource.Id),
                ResourceDeleted e => new Application.Events.ResourceDeleted(e.Resource.Id),
                ReservationAdded e => new ResourceReserved(e.Resource.Id, e.Reservation.DateTime),
                ReservationReleased e => new ResourceReservationReleased(e.Resource.Id, e.Reservation.DateTime),
                ReservationCanceled e => new ResourceReservationCanceled(e.Resource.Id, e.Reservation.DateTime),
                _ => null
            };
    }
}