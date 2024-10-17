import { Table, Button} from "flowbite-react";
import React from "react";
import { InquiryDetailsModal } from "../modals/inquiries/inquiryDetailsModal";
import { OrderDetailsModal } from "../modals/orders/orderDetailsModal";
import dateFromUTCToLocal from "../parsing/dateFromUTCToLocal";
import formatOfferStatus from "../parsing/formatOfferStatus";

interface OrderDetailsProps {
  orderData: any;
}

export function isPackageValid(validTo : string) {
  const todayDate = new Date();
  const validDate = new Date(validTo);
  return todayDate < validDate;
};

export function OrderDetails({
  orderData
}: OrderDetailsProps) {

  const [order, setOrder] = React.useState<any>(orderData);

  const [showInquiryDetailsModal, setShowInquiryDetailsModal] = React.useState(false);
  const [showOrderDetailsModal, setShowOrderDetailsModal] = React.useState(false);

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
        key={order.id}
      >
        <Table.Cell>{order.id}</Table.Cell>
        <Table.Cell>
          <Button onClick={() => setShowInquiryDetailsModal(true)}>Show</Button>
        </Table.Cell>
        <Table.Cell>
          <span className="flex flex-col gap-2">
            <span>{formatAddressFirstLine(order.parcel.source)}</span>
            <span>{formatAddressSecondLine(order.parcel.source)}</span>
          </span>
        </Table.Cell>
        <Table.Cell>
          <span className="flex flex-col gap-2">
            <span>{formatAddressFirstLine(order.parcel.destination)}</span>
            <span>{formatAddressSecondLine(order.parcel.destination)}</span>
          </span>
        </Table.Cell>
        <Table.Cell>{order.courierCompany} </Table.Cell>
        <Table.Cell>
          <span className="flex flex-col gap-2">
            <span>{formatDateCreatedAt(order.orderRequestDate)}</span>
            <span>{formatTimeCreatedAt(order.orderRequestDate)}</span>
          </span>
        </Table.Cell>
        <Table.Cell>{formatOfferStatus(order.status)}</Table.Cell>

        <Table.Cell>
          <Button onClick={() => setShowOrderDetailsModal(true)}>Show</Button>
        </Table.Cell>
        </Table.Row>

        <InquiryDetailsModal
          show={showInquiryDetailsModal}
          setShow={setShowInquiryDetailsModal}
          inquiry={order.parcel}
        />

        <OrderDetailsModal
          show={showOrderDetailsModal}
          setShow={setShowOrderDetailsModal}
          order={order}
        />
    </>
  );
}
