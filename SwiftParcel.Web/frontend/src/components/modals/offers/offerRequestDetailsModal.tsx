import {
    Button,
    Label,
    Modal,
    TextInput,
  } from "flowbite-react";
  import React from "react";
  import dateFromUTCToLocal from "../../parsing/dateFromUTCToLocal";
  import formatOfferStatus from "../../parsing/formatOfferStatus";
import { approvePendingOffer, cancelPendingOffer } from "../../../utils/api";
  
  interface OfferRequestDetailsModalProps {
    show: boolean;
    setShow: (show: boolean) => void;
    offerRequest: any;
    pageContent: string;
  }

  const formatDate = (date: string) => {
    return `${date.substring(0, 10)}  ${date.substring(11, 19)}`;
  };

  const formatDateToUTC = (date: string) => {
    const utcDate = dateFromUTCToLocal(date);
    return `${utcDate.substring(0, 10)}  ${utcDate.substring(11, 19)}`;
  };

  const LabelsWithBorder = ({ idA, valueA, idB, valueB }) => (
    <div className="mb-4 border-b border-gray-200 pb-1 grid grid-cols-1 md:grid-cols-2 gap-4">
      <Label
          id={idA}
          value={valueA}
      />
      <Label
          id={idB}
          value={valueB}
      />
    </div>
  );

  const SectionTitle = ({ title }) => (
    <div className="mb-4 border-b border-gray-400 pb-1">
      <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
    </div>
  );

  const IdInfoDetailsSection = ({ detailsData }) => (
    <div>
        <LabelsWithBorder
            idA="id"
            valueA="Offer request id:"
            idB="id-value"
            valueB={detailsData.offerRequest.id}
        />
        <LabelsWithBorder
            idA="customer-id"
            valueA="Customer id:"
            idB="customer-id-value"
            valueB={detailsData.offerRequest.customerId}
        />
    </div>
  );

  const StatusDetailsSection = ({ detailsData }) => (
    <div>
        <LabelsWithBorder
            idA="status"
            valueA="Status:"
            idB="status-value"
            valueB={formatOfferStatus(detailsData.offerRequest.status)}
        />
        <LabelsWithBorder
            idA="order-request-date"
            valueA="Order request date:"
            idB="order-request-date-value"
            valueB={formatDateToUTC(detailsData.offerRequest.orderRequestDate)}
        />
        <LabelsWithBorder
            idA="request-valid-to"
            valueA="Request valid to:"
            idB="request-valid-to-value"
            valueB={formatDateToUTC(detailsData.offerRequest.requestValidTo)}
        />
    </div>
  );

  const BuyerInfoDetailsSection = ({ detailsData }) => (
    <div>
        <LabelsWithBorder
            idA="buyer-name"
            valueA="Buyer name:"
            idB="buyer-name-value"
            valueB={detailsData.offerRequest.buyerName}
        />
        <LabelsWithBorder
            idA="buyer-email"
            valueA="Buyer email:"
            idB="buyer-email-value"
            valueB={detailsData.offerRequest.buyerEmail}
        />
    </div>
  );

  const AddressDetailsSection = ({ prefix, detailsData }) => (
    <div>
        <LabelsWithBorder
            idA={`${prefix}-street`}
            valueA="Street:"
            idB={`${prefix}-street-value`}
            valueB={detailsData.offerRequest[prefix].street}
        />
        <LabelsWithBorder
            idA={`${prefix}-building-number`}
            valueA="Building number:"
            idB={`${prefix}-building-number-value`}
            valueB={detailsData.offerRequest[prefix].buildingNumber}
        />
        <LabelsWithBorder
            idA={`${prefix}-apartment-number`}
            valueA="Apartment number:"
            idB={`${prefix}-apartment-number-value`}
            valueB={detailsData.offerRequest[prefix].apartmentNumber}
        />
        <LabelsWithBorder
            idA={`${prefix}-city`}
            valueA="City:"
            idB={`${prefix}-city-value`}
            valueB={detailsData.offerRequest[prefix].city}
        />
        <LabelsWithBorder
            idA={`${prefix}-zip-code`}
            valueA="Zip code:"
            idB={`${prefix}-zip-code-value`}
            valueB={detailsData.offerRequest[prefix].zipCode}
        />
        <LabelsWithBorder
            idA={`${prefix}-country`}
            valueA="Country:"
            idB={`${prefix}-country-value`}
            valueB={detailsData.offerRequest[prefix].country}
        />
    </div>
  );

  const AdditionalInfoDetailsSection = ({ detailsData }) => (
    <div>
        { detailsData.offerRequest.status !== "waitingfordecision" ?
          <div>
            <LabelsWithBorder
                idA="decision-date"
                valueA="Decision date:"
                idB="decision-date-value"
                valueB={formatDateToUTC(detailsData.offerRequest.decisionDate)}
            />
          </div>
        : null }
        { detailsData.offerRequest.status === "cancelled" ?
          <div>
            <LabelsWithBorder
                idA="cancellation-reason"
                valueA="Cancellation reason:"
                idB="cancellation-reason-value"
                valueB={detailsData.offerRequest.cancellationReason}
            />
          </div>
        : null }
        { detailsData.offerRequest.status === "pickedup" ?
          <div>
            <LabelsWithBorder
                idA="picked-up-at"
                valueA="Picked up at:"
                idB="picked-up-at-value"
                valueB={formatDateToUTC(detailsData.offerRequest.pickedUpAt)}
            />
          </div>
        : null }
        { detailsData.offerRequest.status === "delivered" ?
          <div>
            <LabelsWithBorder
                idA="delivered-at"
                valueA="Delivered at:"
                idB="delivered-at-value"
                valueB={formatDateToUTC(detailsData.offerRequest.deliveredAt)}
            />
          </div>
        : null }
        { detailsData.offerRequest.status === "cannotdeliver" ?
          <div>
            <LabelsWithBorder
                idA="cannot-deliver-at"
                valueA="Cannot deliver at:"
                idB="cannot-deliver-at-value"
                valueB={formatDateToUTC(detailsData.offerRequest.cannotDeliverAt)}
            />
            <LabelsWithBorder
                idA="cannot-deliver-reason"
                valueA="Cannot deliver reason:"
                idB="cannot-deliver-reason-value"
                valueB={detailsData.offerRequest.cannotDeliverReason}
            />
          </div>
        : null }
    </div>
  );

  export function OfferRequestDetailsModal(props: OfferRequestDetailsModalProps) {
    const close = () => {
      setReason("");
      setAccepted(false);
      setRejected(false);
      setFinalized(false);
      props.setShow(false);
    };

    const submit = async (e: any) => {
      e.preventDefault();
      close();
    };
    
    const [accepted, setAccepted] = React.useState<any>(false);
    const [rejected, setRejected] = React.useState<any>(false);
    const [finalized, setFinalized] = React.useState<any>(false);

    const [reason, setReason] = React.useState<any>("");

    const accept = () => {
      approvePendingOffer(props.offerRequest.id);
      setFinalized(true);
    };

    const reject = (reason: string) => {
      cancelPendingOffer(props.offerRequest.id, reason);
      setFinalized(true);
    };

    const refresh = () => {
      close();
      window.location.reload();
    };

    return (
      <React.Fragment>
        <Modal show={props.show} size="4xl" popup={true} onClose={close}>
          <Modal.Header />
          <Modal.Body style={{ overflowY: 'scroll' }}>
            <form onSubmit={submit}>
              <div className="space-y-6 px-6 pb-4 sm:pb-6 lg:px-8 xl:pb-8">
                <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                  Details of {props.pageContent == "offer-requests" ? 'offer request' : 'pending offer'}:
                </h1>
                <div className="space-y-6 gap-6" style={{ maxHeight: '70vh', paddingBottom: '20px' }}>
                  <div className="space-y-6 gap-6">

                    <SectionTitle title="Id info" />
                    <IdInfoDetailsSection
                        detailsData={props}
                    />

                    <SectionTitle title="Status info" />
                    <StatusDetailsSection
                        detailsData={props}
                    />

                    <SectionTitle title="Buyer info" />
                    <BuyerInfoDetailsSection
                        detailsData={props}
                    />

                    <SectionTitle title="Buyer address" />
                    <AddressDetailsSection
                        prefix="buyerAddress"
                        detailsData={props}
                    />

                    <SectionTitle title="Additional info" />
                    <AdditionalInfoDetailsSection
                        detailsData={props}
                    />

                    { props.pageContent == "pending-offers" ? (
                      <div className="mb-4 border-b border-gray-200 pb-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Button onClick={() => {setAccepted(true); setRejected(false);}}>Accept</Button>
                        <Button onClick={() => {setAccepted(false); setRejected(true);}}>Reject</Button>
                      </div>
                    ) : null }

                    { (accepted && !finalized) ? (
                      <div className="mb-4 pb-1 grid grid-cols-1 md:grid-cols-1 gap-4">
                        <Button onClick={() => accept()}>Confirm acceptation</Button>
                      </div>
                    ) : null }

                    { (rejected && !finalized) ? (
                      <div className="mb-4 pb-1 grid grid-cols-1 md:grid-cols-1 gap-4">
                        <Label htmlFor="reason-of-rejection"  className="mb-2 block text-sm font-medium text-gray-700">
                            Input reason of rejection:
                          </Label>
                          <TextInput 
                            id="reason-of-rejection" 
                            type="string"
                            lang="en"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className={`border-gray-300 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm rounded-md`}
                          />
                        <Button onClick={() => reject(reason)}>Confirm rejection</Button>
                      </div>
                    ) : null }

                    { finalized ? (
                      <div className="mb-4 pb-1 grid grid-cols-1 md:grid-cols-1 gap-4">
                        <Button onClick={() => refresh()}>Refresh page</Button>
                      </div>
                    ) : null }

                    <div style={{ marginBottom: '40px' }}></div>

                  </div>
                </div>
              </div>
            </form>
          </Modal.Body>
        </Modal>
      </React.Fragment>
    );
  }
  