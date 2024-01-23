import React from 'react';
import {
  Alert,
  Button,
  Label,
  TextInput,
  Spinner,
} from "flowbite-react";
// ... other imports

export const CourierOffers = ({ offers, onSelectOffer }) => {
  if (!offers || offers.length === 0) {
    return <p>No offers available at this moment.</p>;
  }

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold text-gray-900">Available Courier Offers</h3>
      <div className="mt-2">
        {offers.map(offer => (
          <div key={offer.id} className="p-4 border border-gray-200 rounded-md mb-3">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-700">{offer.courierName}</p>
                <p className="text-sm text-gray-500">Price: ${offer.price}</p>
              </div>
              <Button color="green" onClick={() => onSelectOffer(offer)}>
                Select Offer
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
