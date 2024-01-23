import { Table, Button} from "flowbite-react";
import React from "react";
import { DeliveryDetailsModal } from "../modals/deliveries/deliveryDetailsModal";
import booleanToString from "../parsing/booleanToString";
import dateFromUTCToLocal from "../parsing/dateFromUTCToLocal";
import formatDeliveryStatus from "../parsing/formatDeliveryStatus";

interface DeliveryDetailsProps {
  deliveryData: any;
  pageContent: string;
}

export function DeliveryDetails({
  deliveryData, pageContent
}: DeliveryDetailsProps) {

  const [delivery, setDelivery] = React.useState<any>(deliveryData);

  const [showDeliveryDetailsModal, setShowDeliveryDetailsModal] = React.useState(false);

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
        key={delivery.id}
      >
        <Table.Cell>{delivery.id}</Table.Cell>
        <Table.Cell>
          <span className="flex flex-col gap-2">
            <span>{formatAddressFirstLine(delivery.source)}</span>
            <span>{formatAddressSecondLine(delivery.source)}</span>
          </span>
        </Table.Cell>
        <Table.Cell>
          <span className="flex flex-col gap-2">
            <span>{formatAddressFirstLine(delivery.destination)}</span>
            <span>{formatAddressSecondLine(delivery.destination)}</span>
          </span>
        </Table.Cell>
        <Table.Cell>
          <span className="flex flex-col gap-2">
            <span>{formatDateCreatedAt(delivery.pickupDate)}</span>
          </span>
        </Table.Cell>
        <Table.Cell>
          <span className="flex flex-col gap-2">
            <span>{formatDateCreatedAt(delivery.deliveryDate)}</span>
          </span>
        </Table.Cell>
        <Table.Cell>{delivery.priority}</Table.Cell>
        <Table.Cell>{booleanToString(delivery.atWeekend)}</Table.Cell>
        <Table.Cell>{formatDeliveryStatus(delivery.status)}</Table.Cell>
        <Table.Cell>
          <span className="flex flex-col gap-2">
            <span>{formatDateCreatedAt(delivery.lastUpdate)}</span>
            <span>{formatTimeCreatedAt(delivery.lastUpdate)}</span>
          </span>
        </Table.Cell>
        <Table.Cell>
          <Button onClick={() => setShowDeliveryDetailsModal(true)}>Show</Button>
        </Table.Cell>
      </Table.Row>

      <DeliveryDetailsModal
          show={showDeliveryDetailsModal}
          setShow={setShowDeliveryDetailsModal}
          delivery={delivery}
          pageContent={pageContent}
      />
    </>
  );
}
