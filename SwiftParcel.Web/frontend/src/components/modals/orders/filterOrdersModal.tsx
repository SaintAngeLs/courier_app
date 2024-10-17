import {
    Alert,
    Button,
    Label,
    Modal,
    Spinner,
    TextInput,
  } from "flowbite-react";
  import React from "react";
  import { HiInformationCircle } from "react-icons/hi";
  import dateFromUTCToLocal from "../../parsing/dateFromUTCToLocal";
  
  interface FilterOrdersModalProps {
    show: boolean;
    setShow: (show: boolean) => void;
    inputData: any;
    tableData: any;
    setTableData: any;
  }
  
  type FilteringDetails = {
    keywordId: string;
    keywordInquiryId: string;
    keywordCourierCompany: string;
    minOrderRequestDate: string;
    maxOrderRequestDate: string;
    minRequestValidTo: string;
    maxRequestValidTo: string;
    minDecisionDate: string;
    maxDecisionDate: string;
    filterStatus: string;
    minPickedUpAt: string;
    maxPickedUpAt: string;
    minDeliveredAt: string;
    maxDeliveredAt: string;
    minCannotDeliverAt: string;
    maxCannotDeliverAt: string;
    keywordCancellationReason: string;
    keywordCannotDeliverReason: string;
    keywordBuyerName: string;
    keywordBuyerEmail: string;
    keywordBuyerAddressStreet: string;
    keywordBuyerAddressBuildingNumber: string;
    keywordBuyerAddressApartmentNumber: string;
    keywordBuyerAddressCity: string;
    keywordBuyerAddressZipCode: string;
    keywordBuyerAddressCountry: string;
  };

  const TextInputWithLabel = ({ id, label, value, onChange, type}) => (
    <div className="mb-4 flex flex-col">
      <Label htmlFor={id} className="mb-2 block text-sm font-medium text-gray-700">{label}</Label>
      <TextInput 
        id={id} 
        type={type}
        lang="en"
        value={value} 
        onChange={(e) => onChange(e)}
        className={`border-gray-300 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm rounded-md`}
      />
    </div>
  );

  const DateInputWithLabel = ({ id, label, value, onChange }) => {
    // Function to format the date to MongoDB format
    const formatToMongoDBDate = (dateString : string) => {
        const date = new Date(dateString);
        return date.toISOString();
    };

    // Function to handle date change
    const handleDateChange = (e : any) => {
        const formattedDate = formatToMongoDBDate(e.target.value);
        onChange(formattedDate);
    };

    return (
        <div className="mb-4">
            <Label htmlFor={id}>{label}</Label>
            <TextInput 
                id={id} 
                type="date" 
                value={value ? new Date(value).toISOString().split('T')[0] : ''} 
                onChange={handleDateChange} 
            />
        </div>
    );
  };

  const SectionTitle = ({ title }) => (
    <div className="mb-4 border-b border-gray-300 pb-1">
      <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
    </div>
  );

  const BasicInfoFilterSection = ({ filterData, handleStringChange }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInputWithLabel
            id="id-keyword"
            label="Keyword in order id:"
            type="text"
            value={filterData.keywordId}
            onChange={handleStringChange('keywordId')}
        />
        <TextInputWithLabel
            id="inquiry-id-keyword"
            label="Keyword in inquiry id:"
            type="text"
            value={filterData.keywordInquiryId}
            onChange={handleStringChange('keywordInquiryId')}
        />  
        <TextInputWithLabel
            id="courier-company-keyword"
            label="Keyword in courier company name:"
            type="text"
            value={filterData.keywordCourierCompany}
            onChange={handleStringChange('keywordCourierCompany')}
        />
    </div>
  );

  const DateInfoFilterSection = ({ filterData, handleDateChange }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DateInputWithLabel
            id="order-request-date-min"
            label="Order request date from:"
            value={filterData.minOrderRequestDate}
            onChange={handleDateChange('minOrderRequestDate')}
        />
        <DateInputWithLabel
            id="order-request-date-max"
            label="Order request date to:"
            value={filterData.maxOrderRequestDate}
            onChange={handleDateChange('maxOrderRequestDate')}
        />

        <DateInputWithLabel
            id="request-valid-to-min"
            label="Request valid to date from:"
            value={filterData.minRequestValidTo}
            onChange={handleDateChange('minRequestValidTo')}
        />
        <DateInputWithLabel
            id="request-valid-to-max"
            label="Request valid to date to:"
            value={filterData.maxRequestValidTo}
            onChange={handleDateChange('maxRequestValidTo')}
        />

        <DateInputWithLabel
            id="decision-date-min"
            label="Decision date from:"
            value={filterData.minDecisionDate}
            onChange={handleDateChange('minDecisionDate')}
        />
        <DateInputWithLabel
            id="decision-date-max"
            label="Decision date to:"
            value={filterData.maxDecisionDate}
            onChange={handleDateChange('maxDecisionDate')}
        />
    </div>
  );

  const StatusInfoFilterSection = ({ filterData, handleStringChange, handleDateChange }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
            <Label
                htmlFor="filter-status"
                value="Status:"
            />
            <select
                id="filter-status"
                value={filterData.filterStatus}
                onChange={handleStringChange('filterStatus')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
                <option value="all">all</option>
                <option value="waitingfordecision">waiting for decision</option>
                <option value="approved">approved</option>
                <option value="confirmed">confirmed</option>
                <option value="cancelled">cancelled</option>
                <option value="pickedup">picked up</option>
                <option value="delivered">delivered</option>
                <option value="cannotdeliver">cannot deliver</option>
            </select>
        </div>
        <div/>

        <div style={{ marginBottom: '5px' }}></div>
        <div style={{ marginBottom: '5px' }}></div>

        <DateInputWithLabel
            id="picked-up-at-min"
            label="Picked up at date from:"
            value={filterData.minPickedUpAt}
            onChange={handleDateChange('minPickedUpAt')}
        />
        <DateInputWithLabel
            id="picked-up-at-max"
            label="Picked up at date to:"
            value={filterData.maxPickedUpAt}
            onChange={handleDateChange('maxPickedUpAt')}
        />

        <DateInputWithLabel
            id="delivered-at-min"
            label="Delivered at date from:"
            value={filterData.minDeliveredAt}
            onChange={handleDateChange('minDeliveredAt')}
        />
        <DateInputWithLabel
            id="delivered-at-max"
            label="Delivered at date to:"
            value={filterData.maxDeliveredAt}
            onChange={handleDateChange('maxDeliveredAt')}
        />

        <DateInputWithLabel
            id="cannot-deliver-at-min"
            label="Cannot deliver at date from:"
            value={filterData.minCannotDeliverAt}
            onChange={handleDateChange('minCannotDeliverAt')}
        />
        <DateInputWithLabel
            id="cannot-deliver-at-max"
            label="Cannot deliver at date to:"
            value={filterData.maxCannotDeliverAt}
            onChange={handleDateChange('maxCannotDeliverAt')}
        />

        <TextInputWithLabel
            id="cancellation-reason-keyword"
            label="Keyword in cancellation reason:"
            type="text"
            value={filterData.keywordCancellationReason}
            onChange={handleStringChange('keywordCancellationReason')}
        />
        <TextInputWithLabel
            id="cannot-deliver-reason-keyword"
            label="Keyword in cannot deliver reason:"
            type="text"
            value={filterData.keywordCannotDeliverReason}
            onChange={handleStringChange('keywordCannotDeliverReason')}
        />
    </div>
  );

  const BuyerInfoFilterSection = ({ filterData, handleStringChange }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInputWithLabel
            id="buyer-name-keyword"
            label="Keyword in buyer name:"
            type="text"
            value={filterData.keywordBuyerName}
            onChange={handleStringChange('keywordBuyerName')}
        />
        <TextInputWithLabel
            id="buyer-email-keyword"
            label="Keyword in buyer email:"
            type="text"
            value={filterData.keywordBuyerEmail}
            onChange={handleStringChange('keywordBuyerEmail')}
        />
    </div>
  );

  const AddressFilterSection = ({ prefix, filterData, handleStringChange }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInputWithLabel
            id={`${prefix}-street-keyword`}
            label={`Keyword in street:`}
            type="text"
            value={filterData[`keyword${prefix}Street`]}
            onChange={handleStringChange(`keyword${prefix}Street`)} 
        />
        <TextInputWithLabel
            id={`${prefix}-building-number-keyword`}
            label={`Keyword in building number:`}
            type="text"
            value={filterData[`keyword${prefix}BuildingNumber`]}
            onChange={handleStringChange(`keyword${prefix}BuildingNumber`)} 
        />

        <TextInputWithLabel
            id={`${prefix}-apartment-number-keyword`}
            label={`Keyword in apartment number:`}
            type="text"
            value={filterData[`keyword${prefix}ApartmentNumber`]}
            onChange={handleStringChange(`keyword${prefix}ApartmentNumber`)} 
        />
        <TextInputWithLabel
            id={`${prefix}-city-keyword`}
            label={`Keyword in city:`}
            type="text"
            value={filterData[`keyword${prefix}City`]}
            onChange={handleStringChange(`keyword${prefix}City`)} 
        />

        <TextInputWithLabel
            id={`${prefix}-zip-code-keyword`}
            label={`Keyword in zip code:`}
            type="text"
            value={filterData[`keyword${prefix}ZipCode`]}
            onChange={handleStringChange(`keyword${prefix}ZipCode`)} 
        />
        <TextInputWithLabel
            id={`${prefix}-city-keyword`}
            label={`Keyword in country:`}
            type="text"
            value={filterData[`keyword${prefix}Country`]}
            onChange={handleStringChange(`keyword${prefix}Country`)} 
        />
    </div>
  );

  export function FilterOrdersModal(props: FilterOrdersModalProps) {
    const close = () => {
      setError("");
      setIsLoading(false);
      props.setShow(false);
    };

    const [filteringDetails, setFilteringDetails] = React.useState<FilteringDetails>({
        keywordId: "",
        keywordInquiryId: "",
        keywordCourierCompany: "",
        minOrderRequestDate: "",
        maxOrderRequestDate: "",
        minRequestValidTo: "",
        maxRequestValidTo: "",
        minDecisionDate: "",
        maxDecisionDate: "",
        filterStatus: "all",
        minPickedUpAt: "",
        maxPickedUpAt: "",
        minDeliveredAt: "",
        maxDeliveredAt: "",
        minCannotDeliverAt: "",
        maxCannotDeliverAt: "",
        keywordCancellationReason: "",
        keywordCannotDeliverReason: "",
        keywordBuyerName: "",
        keywordBuyerEmail: "",
        keywordBuyerAddressStreet: "",
        keywordBuyerAddressBuildingNumber: "",
        keywordBuyerAddressApartmentNumber: "",
        keywordBuyerAddressCity: "",
        keywordBuyerAddressZipCode: "",
        keywordBuyerAddressCountry: ""
    });

    const handleStringChange = <T extends keyof FilteringDetails>(field: T) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        setFilteringDetails(prevState => ({
            ...prevState,
            [field]: newValue
        }));
    };

    const handleDateChange = <T extends keyof FilteringDetails>(field: T) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event;
        setFilteringDetails(prevState => ({
            ...prevState,
            [field]: newValue
        }));
    };

    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState("");

    const clearDetails = () => {
        setFilteringDetails({
            keywordId: "",
            keywordInquiryId: "",
            keywordCourierCompany: "",
            minOrderRequestDate: "",
            maxOrderRequestDate: "",
            minRequestValidTo: "",
            maxRequestValidTo: "",
            minDecisionDate: "",
            maxDecisionDate: "",
            filterStatus: "all",
            minPickedUpAt: "",
            maxPickedUpAt: "",
            minDeliveredAt: "",
            maxDeliveredAt: "",
            minCannotDeliverAt: "",
            maxCannotDeliverAt: "",
            keywordCancellationReason: "",
            keywordCannotDeliverReason: "",
            keywordBuyerName: "",
            keywordBuyerEmail: "",
            keywordBuyerAddressStreet: "",
            keywordBuyerAddressBuildingNumber: "",
            keywordBuyerAddressApartmentNumber: "",
            keywordBuyerAddressCity: "",
            keywordBuyerAddressZipCode: "",
            keywordBuyerAddressCountry: ""
        });
    };

    const submit = async (e: any) => {
      e.preventDefault();
      setError("");
      setIsLoading(true);

      FilterOrders();

      close();
      setIsLoading(false);
    };
  
    const FilterOrders = () => {
      const filteredElements = props.inputData.filter((element : any) =>
        // filtering of id section
        (filteringDetails.keywordId == "" || element.id.toLowerCase().includes(filteringDetails.keywordId.toLowerCase())) &&
        (filteringDetails.keywordInquiryId == "" || element.parcel.id.toLowerCase().includes(filteringDetails.keywordInquiryId.toLowerCase())) &&
        (filteringDetails.keywordCourierCompany == "" || element.courierCompany.toLowerCase().includes(filteringDetails.keywordCourierCompany.toLowerCase())) &&

        (filteringDetails.minOrderRequestDate == "" || new Date(dateFromUTCToLocal(element.orderRequestDate)) >= new Date(filteringDetails.minOrderRequestDate)) &&
        (filteringDetails.maxOrderRequestDate == "" || new Date(dateFromUTCToLocal(element.orderRequestDate)) <= new Date(filteringDetails.maxOrderRequestDate)) &&

        (filteringDetails.minRequestValidTo == "" || new Date(dateFromUTCToLocal(element.requestValidTo)) >= new Date(filteringDetails.minRequestValidTo)) &&
        (filteringDetails.maxRequestValidTo == "" || new Date(dateFromUTCToLocal(element.requestValidTo)) <= new Date(filteringDetails.maxRequestValidTo)) &&

        (filteringDetails.minDecisionDate == "" || new Date(dateFromUTCToLocal(element.decisionDate)) >= new Date(filteringDetails.minDecisionDate)) &&
        (filteringDetails.maxDecisionDate == "" || new Date(dateFromUTCToLocal(element.decisionDate)) <= new Date(filteringDetails.maxDecisionDate)) &&

        // filtering of status
        (filteringDetails.filterStatus == "all" || element.status == filteringDetails.filterStatus) &&

        (filteringDetails.minPickedUpAt == "" || new Date(dateFromUTCToLocal(element.pickedUpAt)) >= new Date(filteringDetails.minPickedUpAt)) &&
        (filteringDetails.maxPickedUpAt == "" || new Date(dateFromUTCToLocal(element.pickedUpAt)) <= new Date(filteringDetails.maxPickedUpAt)) &&

        (filteringDetails.minDeliveredAt == "" || new Date(dateFromUTCToLocal(element.deliveredAt)) >= new Date(filteringDetails.minDeliveredAt)) &&
        (filteringDetails.maxDeliveredAt == "" || new Date(dateFromUTCToLocal(element.deliveredAt)) <= new Date(filteringDetails.maxDeliveredAt)) &&

        (filteringDetails.minCannotDeliverAt == "" || new Date(dateFromUTCToLocal(element.cannotDeliverAt)) >= new Date(filteringDetails.minCannotDeliverAt)) &&
        (filteringDetails.maxCannotDeliverAt == "" || new Date(dateFromUTCToLocal(element.cannotDeliverAt)) <= new Date(filteringDetails.maxCannotDeliverAt)) &&
        
        (filteringDetails.keywordCancellationReason == "" || element.cancellationReason.toLowerCase().includes(filteringDetails.keywordCancellationReason.toLowerCase())) &&
        (filteringDetails.keywordCannotDeliverReason == "" || element.cannotDeliverReason.toLowerCase().includes(filteringDetails.keywordCannotDeliverReason.toLowerCase())) &&

        // filtering of buyer info section
        (filteringDetails.keywordBuyerName == "" || element.buyerName.toLowerCase().includes(filteringDetails.keywordBuyerName.toLowerCase())) &&
        (filteringDetails.keywordBuyerEmail == "" || element.buyerEmail.toLowerCase().includes(filteringDetails.keywordBuyerEmail.toLowerCase())) &&

        // filtering of buyer address section
        (filteringDetails.keywordBuyerAddressStreet == "" || element.buyerAddress.street.toLowerCase().includes(filteringDetails.keywordBuyerAddressStreet.toLowerCase())) &&
        (filteringDetails.keywordBuyerAddressBuildingNumber == "" || element.buyerAddress.buildingNumber.toLowerCase().includes(filteringDetails.keywordBuyerAddressBuildingNumber.toLowerCase())) &&

        (filteringDetails.keywordBuyerAddressApartmentNumber == "" || element.buyerAddress.apartmentNumber.toLowerCase().includes(filteringDetails.keywordBuyerAddressApartmentNumber.toLowerCase())) &&
        (filteringDetails.keywordBuyerAddressCity == "" || element.buyerAddress.city.toLowerCase().includes(filteringDetails.keywordBuyerAddressCity.toLowerCase())) &&

        (filteringDetails.keywordBuyerAddressZipCode == "" || element.buyerAddress.zipCode.toLowerCase().includes(filteringDetails.keywordBuyerAddressZipCode.toLowerCase())) &&
        (filteringDetails.keywordBuyerAddressCountry == "" || element.buyerAddress.country.toLowerCase().includes(filteringDetails.keywordBuyerAddressCountry.toLowerCase()))
      );

      props.setTableData(filteredElements);
    };
    
    return (
      <React.Fragment>
        <Modal show={props.show} size="4xl" popup={true} onClose={close}>
          <Modal.Header />
          <Modal.Body style={{ overflowY: 'scroll' }}>
            <form onSubmit={submit}>
              <div className="space-y-6 px-6 pb-4 sm:pb-6 lg:px-8 xl:pb-8">
                <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                  Filter orders by attributes:
                </h1>
                {error ? (
                  <Alert color="failure" icon={HiInformationCircle}>
                    <span>{error}</span>
                  </Alert>
                ) : null}
                <div className="space-y-6 gap-6" style={{ maxHeight: '70vh', paddingBottom: '20px' }}>
                  <div>

                    <div className="space-y-6 w-full" style={{ display: 'flex', justifyContent: 'center' }}>
                        <Button onClick={clearDetails}>Clear filtering details</Button>
                    </div>
                    <div style={{ marginBottom: '20px' }}></div>

                    <SectionTitle title="Basic info" />
                    <BasicInfoFilterSection
                        filterData={filteringDetails}
                        handleStringChange={handleStringChange}
                    />
                    <div style={{ marginBottom: '20px' }}></div>

                    <SectionTitle title="Date info" />
                    <DateInfoFilterSection
                        filterData={filteringDetails}
                        handleDateChange={handleDateChange}
                    />
                    <div style={{ marginBottom: '20px' }}></div>

                    <SectionTitle title="Status info" />
                    <StatusInfoFilterSection
                        filterData={filteringDetails}
                        handleStringChange={handleStringChange}
                        handleDateChange={handleDateChange}
                    />
                    <div style={{ marginBottom: '20px' }}></div>

                    <SectionTitle title="Buyer info" />
                    <BuyerInfoFilterSection
                        filterData={filteringDetails}
                        handleStringChange={handleStringChange}
                    />
                    <div style={{ marginBottom: '20px' }}></div>

                    <SectionTitle title="Buyer address" />
                    <AddressFilterSection
                        prefix="BuyerAddress"
                        filterData={filteringDetails}
                        handleStringChange={handleStringChange}
                    />
                    <div style={{ marginBottom: '20px' }}></div>

                    <div className="space-y-6 w-full" style={{ display: 'flex', justifyContent: 'center' }}>
                    {isLoading ? (
                        <Button>
                        <div className="mr-3">
                            <Spinner size="sm" light={true} />
                        </div>
                        Loading ...
                        </Button>
                    ) : (
                        <Button type="submit" onClick={submit}>Submit filtering details</Button>
                    )}
                    </div>

                    <div style={{ marginBottom: '20px' }}></div>

                  </div>
                </div>
              </div>
            </form>
          </Modal.Body>
        </Modal>
      </React.Fragment>
    );
  }
  