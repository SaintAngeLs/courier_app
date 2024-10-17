import {
    Label,
    Modal,
  } from "flowbite-react";
  import React from "react";
  import booleanToString from "../../parsing/booleanToString";
  import dateFromUTCToLocal from "../../parsing/dateFromUTCToLocal";
  
  interface InquiryDetailsModalProps {
    show: boolean;
    setShow: (show: boolean) => void;
    inquiry: any;
  }

  const formatDate = (date: string) => {
    return `${date.substring(0, 10)}`;
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
            valueA="Inquiry's id:"
            idB="id-value"
            valueB={detailsData.inquiry.id}
        />
        <LabelsWithBorder
            idA="customer-id"
            valueA="Customer's id:"
            idB="customer-id-value"
            valueB={detailsData.inquiry.customerId}
        />
        <LabelsWithBorder
            idA="description"
            valueA="Description:"
            idB="description-value"
            valueB={detailsData.inquiry.description}
        />
    </div>
  );

  const PackageInfoDetailsSection = ({ detailsData }) => (
    <div>
        <LabelsWithBorder
            idA="width"
            valueA="Width:"
            idB="width-value"
            valueB={detailsData.inquiry.width}
        />
        <LabelsWithBorder
            idA="height"
            valueA="Height:"
            idB="height-value"
            valueB={detailsData.inquiry.height}
        />
        <LabelsWithBorder
            idA="depth"
            valueA="Depth:"
            idB="depth-value"
            valueB={detailsData.inquiry.depth}
        />
        <LabelsWithBorder
            idA="weight"
            valueA="Weight:"
            idB="weight-value"
            valueB={detailsData.inquiry.weight}
        />
    </div>
  );

  const AddressDetailsSection = ({ prefix, detailsData }) => (
    <div>
        <LabelsWithBorder
            idA={`${prefix}-street`}
            valueA="Street:"
            idB={`${prefix}-street-value`}
            valueB={detailsData.inquiry[prefix].street}
        />
        <LabelsWithBorder
            idA={`${prefix}-building-number`}
            valueA="Building number:"
            idB={`${prefix}-building-number-value`}
            valueB={detailsData.inquiry[prefix].buildingNumber}
        />
        <LabelsWithBorder
            idA={`${prefix}-apartment-number`}
            valueA="Apartment number:"
            idB={`${prefix}-apartment-number-value`}
            valueB={detailsData.inquiry[prefix].apartmentNumber}
        />
        <LabelsWithBorder
            idA={`${prefix}-city`}
            valueA="City:"
            idB={`${prefix}-city-value`}
            valueB={detailsData.inquiry[prefix].city}
        />
        <LabelsWithBorder
            idA={`${prefix}-zipCode`}
            valueA="Zip code:"
            idB={`${prefix}-zip-code-value`}
            valueB={detailsData.inquiry[prefix].zipCode}
        />
        <LabelsWithBorder
            idA={`${prefix}-country`}
            valueA="Country:"
            idB={`${prefix}-country-value`}
            valueB={detailsData.inquiry[prefix].country}
        />
    </div>
  );

  const DateInfoDetailsSection = ({ detailsData }) => (
    <div>
        <LabelsWithBorder
            idA="pickup-date"
            valueA="Pickup date:"
            idB="pickup-date-value"
            valueB={formatDate(detailsData.inquiry.pickupDate)}
        />
        <LabelsWithBorder
            idA="delivery-date"
            valueA="Delivery date:"
            idB="delivery-date-value"
            valueB={formatDate(detailsData.inquiry.deliveryDate)}
        />
        <LabelsWithBorder
            idA="created-at"
            valueA="Created at:"
            idB="created-at-value"
            valueB={formatDateToUTC(detailsData.inquiry.createdAt)}
        />
        <LabelsWithBorder
            idA="valid-to"
            valueA="Valid to:"
            idB="valid-to-value"
            valueB={formatDateToUTC(detailsData.inquiry.validTo)}
        />
    </div>
  );

  const AdditionalInfoDetailsSection = ({ detailsData }) => (
    <div>
        <LabelsWithBorder
            idA="priority"
            valueA="Priority:"
            idB="priority-value"
            valueB={detailsData.inquiry.priority}
        />
        <LabelsWithBorder
            idA="at-weekend"
            valueA="At weekend:"
            idB="at-weekend-value"
            valueB={booleanToString(detailsData.inquiry.atWeekend)}
        />
        <LabelsWithBorder
            idA="is-company"
            valueA="Is company:"
            idB="is-company-value"
            valueB={booleanToString(detailsData.inquiry.isCompany)}
        />
        <LabelsWithBorder
            idA="vip-package"
            valueA="Vip package:"
            idB="vip-package-value"
            valueB={booleanToString(detailsData.inquiry.vipPackage)}
        />
    </div>
  );

  export function InquiryDetailsModal(props: InquiryDetailsModalProps) {
    const close = () => {
      props.setShow(false);
    };

    const submit = async (e: any) => {
      e.preventDefault();
      close();
    };
    
    return (
      <React.Fragment>
        <Modal show={props.show} size="4xl" popup={true} onClose={close}>
          <Modal.Header />
          <Modal.Body style={{ overflowY: 'scroll' }}>
            <form onSubmit={submit}>
              <div className="space-y-6 px-6 pb-4 sm:pb-6 lg:px-8 xl:pb-8">
                <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                  Details of inquiry:
                </h1>
                <div className="space-y-6 gap-6" style={{ maxHeight: '70vh', paddingBottom: '20px' }}>
                  <div className="space-y-6 gap-6">

                    <SectionTitle title="Basic info" />
                    <BasicInfoDetailsSection
                        detailsData={props}
                    />

                    <SectionTitle title="Package info" />
                    <PackageInfoDetailsSection
                        detailsData={props}
                    />

                    <SectionTitle title="Source address" />
                    <AddressDetailsSection
                        prefix="source"
                        detailsData={props}
                    />

                    <SectionTitle title="Destination address" />
                    <AddressDetailsSection
                        prefix="destination"
                        detailsData={props}
                    />

                    <SectionTitle title="Date info" />
                    <DateInfoDetailsSection
                        detailsData={props}
                    />

                    <SectionTitle title="Additional info" />
                    <AdditionalInfoDetailsSection
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
  