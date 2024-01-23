using Convey.CQRS.Commands;
using SwiftParcel.Services.Orders.Application.Exceptions;
using SwiftParcel.Services.Orders.Application.Services.Clients;
using SwiftParcel.Services.Orders.Core.Entities;

namespace SwiftParcel.Services.Orders.Application.Commands.Handlers
{
    public class CreateOrderMiniCurrierHandler: ICommandHandler<CreateOrderMiniCurrier>
    {
        private readonly ILecturerApiServiceClient _lecturerApiServiceClient;

        public CreateOrderMiniCurrierHandler(ILecturerApiServiceClient lecturerApiServiceClient)
        {
            _lecturerApiServiceClient = lecturerApiServiceClient;
        }
        public async Task HandleAsync(CreateOrderMiniCurrier command, CancellationToken cancellationToken)
        {
            var orderValidation = new Order(Guid.Empty, Guid.Empty, 
                OrderStatus.WaitingForDecision, DateTime.Now, command.Name, command.Email, command.Address,
                null, null, null, null, string.Empty, string.Empty, null);

            var response = await _lecturerApiServiceClient.PostOfferAsync(command);
            if (response == null)
            {
                throw new LecturerApiServiceConnectionException();
            }
            if (!response.IsSuccessStatusCode)
            {
                throw new LecturerApiServiceException(response.ReasonPhrase);
            }
        }
    }
}