import { Table, Button} from "flowbite-react";
import React from "react";
import { InquiryDetailsModal } from "../modals/inquiries/inquiryDetailsModal";
import { OfferRequestDetailsModal } from "../modals/offers/offerRequestDetailsModal";
import dateFromUTCToLocal from "../parsing/dateFromUTCToLocal";
import formatOfferStatus from "../parsing/formatOfferStatus";

interface OfferRequestDetailsProps {
  offerRequestData: any;
  pageContent: string;
}

export function OfferRequestDetails({
  offerRequestData, pageContent
}: OfferRequestDetailsProps) {

  const [offerRequest, setOfferRequest] = React.useState<any>(offerRequestData);

  const [showInquiryDetailsModal, setShowInquiryDetailsModal] = React.useState(false);
  const [showOfferRequestDetailsModal, setShowOfferRequestDetailsModal] = React.useState(false);

  const formatAddressFirstLine = (address : any) => {
    if (address.apartmentNumber.length === 0) {
      return `${address.street} ${address.buildingNumber}`;
    }
    else {
      return `${address.street} ${address.buildingNumber}/${address.apartmentNumber}`;
    }
  }

  const formatAddressSecondLine = (address : any) => {
    return `${address.zipCode} ${address.city}, ${address.country}`;
  }

  const formatDateCreatedAt = (utcCreatedAt: string) => {
    return dateFromUTCToLocal(utcCreatedAt).substring(0, 10);
  };

  const formatTimeCreatedAt = (utcCreatedAt: string) => {
    return dateFromUTCToLocal(utcCreatedAt).substring(11, 19);
  };

  return (
    <>
      <Table.Row
        className="bg-white dark:border-gray-700 dark:bg-gray-800"
        key={offerRequest.id}
      >
        <Table.Cell>{offerRequest.id}</Table.Cell>
        <Table.Cell>
          <Button onClick={() => setShowInquiryDetailsModal(true)}>Show</Button>
        </Table.Cell>
        <Table.Cell>{formatOfferStatus(offerRequest.status)}</Table.Cell>
        <Table.Cell>
          <span className="flex flex-col gap-2">
            <span>{formatDateCreatedAt(offerRequest.orderRequestDate)}</span>
            <span>{formatTimeCreatedAt(offerRequest.orderRequestDate)}</span>
          </span>
        </Table.Cell>
        <Table.Cell>
          <span className="flex flex-col gap-2">
            <span>{formatDateCreatedAt(offerRequest.requestValidTo)}</span>
            <span>{formatTimeCreatedAt(offerRequest.requestValidTo)}</span>
          </span>
        </Table.Cell>
        <Table.Cell>{offerRequest.buyerName}</Table.Cell>
        <Table.Cell>{offerRequest.buyerEmail}</Table.Cell>
        <Table.Cell>
          <span className="flex flex-col gap-2">
            <span>{formatAddressFirstLine(offerRequest.buyerAddress)}</span>
            <span>{formatAddressSecondLine(offerRequest.buyerAddress)}</span>
          </span>
        </Table.Cell>
        <Table.Cell>
          <Button onClick={() => setShowOfferRequestDetailsModal(true)}>Show</Button>
        </Table.Cell>
      </Table.Row>

      <InquiryDetailsModal
          show={showInquiryDetailsModal}
          setShow={setShowInquiryDetailsModal}
          inquiry={offerRequest.parcel}
      />

      <OfferRequestDetailsModal
          show={showOfferRequestDetailsModal}
          setShow={setShowOfferRequestDetailsModal}
          offerRequest={offerRequest}
          pageContent={pageContent}
      />
    </>
  );
}
