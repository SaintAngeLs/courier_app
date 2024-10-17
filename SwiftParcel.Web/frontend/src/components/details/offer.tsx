import { Table, Button} from "flowbite-react";
import React from "react";
import { UserDetailsModal } from "../modals/offers/userDetailsModal";
import dateFromUTCToLocal from "../parsing/dateFromUTCToLocal";
import { getUserIdFromStorage } from "../../utils/storage";

interface OfferDetailsProps {
  offerData: any;
  userData: any;
}

export function OfferDetails({
  offerData, userData
}: OfferDetailsProps) {

  const [offer, setOffer] = React.useState<any>(offerData);

  const [showUserDetailsModal, setShowUserDetailsModal] = React.useState(false);

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
        key={offer.parcelId}
      >
        <Table.Cell>{offer.parcelId}</Table.Cell>
        <Table.Cell>{offer.totalPrice}</Table.Cell>
        <Table.Cell>
          <span className="flex flex-col gap-2">
            <span>{formatDateCreatedAt(offer.expiringAt)}</span>
            <span>{formatTimeCreatedAt(offer.expiringAt)}</span>
          </span>
        </Table.Cell>
        <Table.Cell>{offer.companyName} </Table.Cell>
        <Table.Cell>
          <Button onClick={() => {console.log("userData:", userData); setShowUserDetailsModal(true);}}>Choose that offer</Button>
        </Table.Cell>
      </Table.Row>

      { (userData !== null) ?
        <UserDetailsModal
          show={showUserDetailsModal}
          setShow={setShowUserDetailsModal}
          userId={getUserIdFromStorage()}
          offer={offer}
          userData={userData}
        />
      : null }
    </>
  );
}
