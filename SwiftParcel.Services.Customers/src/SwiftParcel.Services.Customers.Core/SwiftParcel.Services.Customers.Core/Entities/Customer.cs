using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SwiftParcel.Services.Customers.Core.Exceptions;

namespace SwiftParcel.Services.Customers.Core.Entities
{
    public class Customer : AggregateRoot
    {
        private ISet<Guid> _completedOrders = new HashSet<Guid>();

        public string Email { get; private set; }
        public string FirstName { get; private set; }
        public string LastName { get; private set; }  
        public string FullName => $"{FirstName} {LastName}";
        public string Address { get; private set; }
        public bool IsVip { get; private set; }
        public State State { get; private set; }
        public DateTime CreatedAt { get; private set; }

        public IEnumerable<Guid> CompletedOrders
        {
            get => _completedOrders;
            set => _completedOrders = new HashSet<Guid>(value);
        }

        public Customer(Guid id, string email, DateTime createdAt) : this(id, email, createdAt, string.Empty,
            string.Empty, string.Empty, false, State.Incomplete, Enumerable.Empty<Guid>())
        {
        }

        public Customer(Guid id, string email, DateTime createdAt, string firstName, string lastName, string address, bool isVip,
            State state, IEnumerable<Guid> completedOrders = null)
        {
            Id = id;
            Email = email;
            CreatedAt = createdAt;
            FirstName = firstName; 
            LastName = lastName; 
            Address = address;
            IsVip = isVip;
            CompletedOrders = completedOrders ?? Enumerable.Empty<Guid>();
            State = state;
        }

        public void CompleteRegistration(string firstName, string lastName, string address)
        {

            if (string.IsNullOrWhiteSpace(firstName) || string.IsNullOrWhiteSpace(lastName))
            {
                throw new InvalidCustomerFullNameException(Id,  $"{firstName} {lastName}");
            }

            if (string.IsNullOrWhiteSpace(address))
            {
                throw new InvalidCustomerAddressException(Id, address);
            }

            if (State != State.Incomplete)
            {
                throw new CannotChangeCustomerStateException(Id, State);
            }

            FirstName = firstName;
            LastName = lastName;
            Address = address;
            State = State.Valid;
            AddEvent(new CustomerRegistrationCompleted(this));
        }

        public void SetValid() => SetState(State.Valid);
        
        public void SetIncomplete() => SetState(State.Incomplete);

        public void Lock() => SetState(State.Locked);

        public void MarkAsSuspicious() => SetState(State.Suspicious);

        private void SetState(State state)
        {
            var previousState = State;
            State = state;
            AddEvent(new CustomerStateChanged(this, previousState));
        }

        public void SetVip()
        {
            if (IsVip)
            {
                return;
            }

            IsVip = true;
            AddEvent(new CustomerBecameVip(this));
        }

        public void AddCompletedOrder(Guid orderId)
        {
            if (orderId == Guid.Empty)
            {
                return;
            }

            _completedOrders.Add(orderId);
        }
    }
}