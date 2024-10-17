import {
    Button,
    Label,
    Modal,
    TextInput,
  } from "flowbite-react";
  import React from "react";
  import dateFromUTCToLocal from "../../parsing/dateFromUTCToLocal";
  import formatOfferStatus from "../../parsing/formatOfferStatus";
import { confirmOrder, cancelOrder } from "../../../utils/api";
  
  interface OrderDetailsModalProps {
    show: boolean;
    setShow: (show: boolean) => void;
    order: any;
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

  const BasicInfoDetailsSection = ({ detailsData }) => (
    <div>
        <LabelsWithBorder
            idA="id"
            valueA="Order id:"
            idB="id-value"
            valueB={detailsData.order.id}
        />
        <LabelsWithBorder
            idA="courier-company"
            valueA="Courier company:"
            idB="id-value"
            valueB={detailsData.order.courierCompany}
        />
        <LabelsWithBorder
            idA="order-request-date"
            valueA="Order request date:"
            idB="order-request-date-value"
            valueB={formatDateToUTC(detailsData.order.orderRequestDate)}
        />
        { detailsData.order.status === "waitingfordecision" ?
          <LabelsWithBorder
            idA="request-valid-to"
            valueA="Request valid to:"
            idB="request-valid-to-value"
            valueB={formatDateToUTC(detailsData.order.requestValidTo)}
          />
        :
          <LabelsWithBorder
            idA="decision-date"
            valueA="Decision date:"
            idB="decision-date-value"
            valueB={formatDateToUTC(detailsData.order.decisionDate)}
          />
        }
    </div>
  );

  const StatusDetailsSection = ({ detailsData, confirm, cancel, finalized, refresh }) => (
    <div>
        <LabelsWithBorder
            idA="status"
            valueA="Status:"
            idB="status-value"
            valueB={formatOfferStatus(detailsData.order.status)}
        />
        { detailsData.order.status === "approved" ?
            <div>
              { (new Date() < new Date(detailsData.order.requestValidTo)) ? (
                <div className="mb-4 border-b border-gray-200 pb-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button onClick={() => confirm()}>Confirm</Button>
                  <Button onClick={() => cancel()}>Cancel</Button>
                </div>
              ) : (
                <div className="mb-4 border-b border-gray-200 pb-1 grid gap-4">
                  <Label
                    id="offer-request-expired"
                    value="Your offer request has been expired!"
                  />
                </div>
              ) }

              { finalized ? (
                <div className="mb-4 pb-1 grid grid-cols-1 md:grid-cols-1 gap-4">
                  <Button onClick={() => refresh()}>Refresh page</Button>
                </div>
              ) : null }
            </div>
        : null }
        { detailsData.order.status === "cancelled" ?
            <LabelsWithBorder
                idA="cancellation-reason"
                valueA="Cancellation reason:"
                idB="cancellation-reason-value"
                valueB={detailsData.order.cancellationReason}
            />
        : null }
        { detailsData.order.status === "pickedup" ?
            <LabelsWithBorder
                idA="picked-up-at"
                valueA="Picked up at:"
                idB="picked-up-at-value"
                valueB={formatDateToUTC(detailsData.order.pickedUpAt)}
            />
        : null }
        { detailsData.order.status === "delivered" ?
            <LabelsWithBorder
                idA="delivered-at"
                valueA="Delivered at:"
                idB="delivered-at-value"
                valueB={formatDateToUTC(detailsData.order.deliveredAt)}
            />
        : null }
        { detailsData.order.status === "cannotdeliver" ?
            <div>
                <LabelsWithBorder
                    idA="cannot-deliver-at"
                    valueA="Cannot deliver at:"
                    idB="cannot-deliver-at-value"
                    valueB={formatDateToUTC(detailsData.order.cannotDeliverAt)}
                />
                <LabelsWithBorder
                    idA="cannot-deliver-reason"
                    valueA="Cannot deliver reason:"
                    idB="cannot-deliver-reason-value"
                    valueB={detailsData.order.cannotDeliverReason}
                />
            </div>
        : null }
    </div>
  );

  const BuyerInfoDetailsSection = ({ detailsData }) => (
    <div>
        <LabelsWithBorder
            idA="buyer-name"
            valueA="Buyer name:"
            idB="buyer-name-value"
            valueB={detailsData.order.buyerName}
        />
        <LabelsWithBorder
            idA="buyer-email"
            valueA="Buyer email:"
            idB="buyer-email-value"
            valueB={detailsData.order.buyerEmail}
        />
    </div>
  );

  const AddressDetailsSection = ({ prefix, detailsData }) => (
    <div>
        <LabelsWithBorder
            idA={`${prefix}-street`}
            valueA="Street:"
            idB={`${prefix}-street-value`}
            valueB={detailsData.order[prefix].street}
        />
        <LabelsWithBorder
            idA={`${prefix}-building-number`}
            valueA="Building number:"
            idB={`${prefix}-building-number-value`}
            valueB={detailsData.order[prefix].buildingNumber}
        />
        <LabelsWithBorder
            idA={`${prefix}-apartment-number`}
            valueA="Apartment number:"
            idB={`${prefix}-apartment-number-value`}
            valueB={detailsData.order[prefix].apartmentNumber}
        />
        <LabelsWithBorder
            idA={`${prefix}-city`}
            valueA="City:"
            idB={`${prefix}-city-value`}
            valueB={detailsData.order[prefix].city}
        />
        <LabelsWithBorder
            idA={`${prefix}-zip-code`}
            valueA="Zip code:"
            idB={`${prefix}-zip-code-value`}
            valueB={detailsData.order[prefix].zipCode}
        />
        <LabelsWithBorder
            idA={`${prefix}-country`}
            valueA="Country:"
            idB={`${prefix}-country-value`}
            valueB={detailsData.order[prefix].country}
        />
    </div>
  );

  export function OrderDetailsModal(props: OrderDetailsModalProps) {
    const close = () => {
      setReason("");
      setFinalized(false);
      props.setShow(false);
    };

    const submit = async (e: any) => {
      e.preventDefault();
      close();
    };
    
    const [finalized, setFinalized] = React.useState<any>(false);

    const [reason, setReason] = React.useState<any>("");

    const confirm = () => {
      confirmOrder(props.order.id, props.order.company);
      setFinalized(true);
    };

    const cancel = () => {
      cancelOrder(props.order.id, props.order.company);
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
                  Details of your order:
                </h1>
                <div className="space-y-6 gap-6" style={{ maxHeight: '70vh', paddingBottom: '20px' }}>
                  <div className="space-y-6 gap-6">

                    <SectionTitle title="Basic info" />
                    <BasicInfoDetailsSection
                        detailsData={props}
                    />

                    <SectionTitle title="Status info" />
                    <StatusDetailsSection
                        detailsData={props}
                        confirm={confirm}
                        cancel={cancel}
                        finalized={finalized}
                        refresh={refresh}
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
  