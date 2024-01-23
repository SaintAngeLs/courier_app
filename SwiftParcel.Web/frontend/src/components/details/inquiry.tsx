import { Table, Button} from "flowbite-react";
import React from "react";
import { InquiryDetailsModal } from "../modals/inquiries/inquiryDetailsModal";
import dateFromUTCToLocal from "../parsing/dateFromUTCToLocal";

interface InquiryDetailsProps {
  inquiryData: any;
}

export function isPackageValid(validTo : string) {
  const todayDate = new Date();
  const validDate = new Date(validTo);
  return todayDate < validDate;
};

export function InquiryDetails({
  inquiryData
}: InquiryDetailsProps) {

  const [inquiry, setInquiry] = React.useState<any>(inquiryData);

  const [showInquiryDetailsModal, setShowInquiryDetailsModal] = React.useState(false);

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
        key={inquiry.id}
      >
        <Table.Cell>{inquiry.id}</Table.Cell>
        <Table.Cell>{inquiry.width} cm x {inquiry.height} cm x {inquiry.depth} cm</Table.Cell>
        <Table.Cell>{inquiry.weight} kg</Table.Cell>
        <Table.Cell>
          <span className="flex flex-col gap-2">
            <span>{formatAddressFirstLine(inquiry.source)}</span>
            <span>{formatAddressSecondLine(inquiry.source)}</span>
          </span>
        </Table.Cell>
        <Table.Cell>
          <span className="flex flex-col gap-2">
            <span>{formatAddressFirstLine(inquiry.destination)}</span>
            <span>{formatAddressSecondLine(inquiry.destination)}</span>
          </span>
        </Table.Cell>
        <Table.Cell>
          <span className="flex flex-col gap-2">
            <span>{formatDateCreatedAt(inquiry.createdAt)}</span>
            <span>{formatTimeCreatedAt(inquiry.createdAt)}</span>
          </span>
        </Table.Cell>
        <Table.Cell>{isPackageValid(inquiry.validTo) ? "valid" : "expired"}</Table.Cell>
        <Table.Cell>
          <Button onClick={() => setShowInquiryDetailsModal(true)}>Show</Button>
        </Table.Cell>
      </Table.Row>

      <InquiryDetailsModal
          show={showInquiryDetailsModal}
          setShow={setShowInquiryDetailsModal}
          inquiry={inquiry}
      />
    </>
  );
}
