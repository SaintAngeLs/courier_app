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
  import booleanToString from "../../parsing/booleanToString";
  
  interface FilterDeliveriesModalProps {
    show: boolean;
    setShow: (show: boolean) => void;
    inputData: any;
    tableData: any;
    setTableData: any;
    pageContent: string;
  }
  
  type FilteringDetails = {
    keywordId: string;
    keywordOrderId: string;
    filterStatus: string;
    minDeliveryAttemptDate: string;
    maxDeliveryAttemptDate: string;
    keywordCannotDeliverReason: string;
    minLastUpdate: string;
    maxLastUpdate: string;
    minPickupDate: string;
    maxPickupDate: string;
    minDeliveryDate: string;
    maxDeliveryDate: string;
    filterPriority: string;
    filterAtWeekend: string;
    minVolume: number;
    maxVolume: number;
    minWeight: number;
    maxWeight: number;
    keywordSourceStreet: string;
    keywordSourceBuildingNumber: string;
    keywordSourceApartmentNumber: string;
    keywordSourceCity: string;
    keywordSourceZipCode: string;
    keywordSourceCountry: string;
    keywordDestinationStreet: string;
    keywordDestinationBuildingNumber: string;
    keywordDestinationApartmentNumber: string;
    keywordDestinationCity: string;
    keywordDestinationZipCode: string;
    keywordDestinationCountry: string;
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

  const IdInfoFilterSection = ({ filterData, handleStringChange }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInputWithLabel
            id="id-keyword"
            label="Keyword in delivery id:"
            type="text"
            value={filterData.keywordId}
            onChange={handleStringChange('keywordId')}
        />
        <TextInputWithLabel
            id="customer-id-keyword"
            label="Keyword in order id:"
            type="text"
            value={filterData.keywordOrderId}
            onChange={handleStringChange('keywordOrderId')}
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
                <option value="unassigned">unassigned</option>
                <option value="assigned">assigned</option>
                <option value="inprogress">in progress</option>
                <option value="completed">completed</option>
                <option value="cannotdeliver">cannot deliver</option>
            </select>
        </div>

        <TextInputWithLabel
            id="cannot-deliver-reason-keyword"
            label="Keyword in cannot deliver reason:"
            type="text"
            value={filterData.keywordCannotDeliverReason}
            onChange={handleStringChange('keywordCannotDeliverReason')}
        />

        <DateInputWithLabel
            id="delivery-attempt-date-min"
            label="Delivery attempt date from:"
            value={filterData.minDeliveryAttemptDate}
            onChange={handleDateChange('minDeliveryAttemptDate')}
        />
        <DateInputWithLabel
            id="delivery-attempt-date-max"
            label="Delivery attempt date to:"
            value={filterData.maxDeliveryAttemptDate}
            onChange={handleDateChange('maxDeliveryAttemptDate')}
        />

        <DateInputWithLabel
            id="last-update-min"
            label="Last update date from:"
            value={filterData.minLastUpdate}
            onChange={handleDateChange('minLastUpdate')}
        />
        <DateInputWithLabel
            id="last-update-max"
            label="Last update date to:"
            value={filterData.maxLastUpdate}
            onChange={handleDateChange('maxLastUpdate')}
        />
    </div>
  );

  const OrderInfoFilterSection = ({ filterData, handleDateChange, handleStringChange }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DateInputWithLabel
            id="pickup-date-min"
            label="Pickup date from:"
            value={filterData.minPickupDate}
            onChange={handleDateChange('minPickupDate')}
        />
        <DateInputWithLabel
            id="pickup-date-max"
            label="Pickup date to:"
            value={filterData.maxPickupDate}
            onChange={handleDateChange('maxPickupDate')}
        />

        <DateInputWithLabel
            id="delivery-date-min"
            label="Delivery date from:"
            value={filterData.minDeliveryDate}
            onChange={handleDateChange('minDeliveryDate')}
        />
        <DateInputWithLabel
            id="delivery-date-max"
            label="Delivery date to:"
            value={filterData.maxDeliveryDate}
            onChange={handleDateChange('maxDeliveryDate')}
        />

        <div>
          <Label htmlFor="filter-priority" className="mb-2 block text-sm font-medium text-gray-700">Priority:</Label>
          <select
              id="filter-priority"
              value={filterData.filterPriority}
              onChange={handleStringChange('filterPriority')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
              <option value="all">all</option>
              <option value="Low">low</option>
              <option value="High">high</option>
          </select>
        </div>

        <div>
          <Label htmlFor="filter-at-weekend" className="mb-2 block text-sm font-medium text-gray-700">At weekend:</Label>
          <select
              id="filter-at-weekend"
              value={filterData.filterAtWeekend}
              onChange={handleStringChange('filterAtWeekend')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
              <option value="all">all</option>
              <option value="true">yes</option>
              <option value="false">no</option>
          </select>
        </div>
        
    </div>
  );

  const PackageInfoFilterSection = ({ filterData, handleNumberChange }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInputWithLabel
            id="volume-min"
            label="Minimum volume:"
            type="number"
            value={filterData.minVolume}
            onChange={handleNumberChange('minVolume')}
        />
        <TextInputWithLabel
            id="volume-max"
            label="Maximum volume:"
            type="number"
            value={filterData.maxVolume}
            onChange={handleNumberChange('maxVolume')}
        />

        <TextInputWithLabel
            id="weight-min"
            label="Minimum weight:"
            type="number"
            value={filterData.minWeight}
            onChange={handleNumberChange('minWeight')}
        />
        <TextInputWithLabel
            id="weight-max"
            label="Maximum weight:"
            type="number"
            value={filterData.maxWeight}
            onChange={handleNumberChange('maxWeight')}
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

  export function FilterDeliveriesModal(props: FilterDeliveriesModalProps) {
    const close = () => {
      setError("");
      setIsLoading(false);
      props.setShow(false);
    };

    const minDefNum = 0;
    const maxDefNum = 99999;

    const [filteringDetails, setFilteringDetails] = React.useState<FilteringDetails>({
        keywordId: "",
        keywordOrderId: "",
        filterStatus: "all",
        minDeliveryAttemptDate: "",
        maxDeliveryAttemptDate: "",
        keywordCannotDeliverReason: "",
        minLastUpdate: "",
        maxLastUpdate: "",
        minPickupDate: "",
        maxPickupDate: "",
        minDeliveryDate: "",
        maxDeliveryDate: "",
        filterPriority: "all",
        filterAtWeekend: "all",
        minVolume: minDefNum,
        maxVolume: maxDefNum,
        minWeight: minDefNum,
        maxWeight: maxDefNum,
        keywordSourceStreet: "",
        keywordSourceBuildingNumber: "",
        keywordSourceApartmentNumber: "",
        keywordSourceCity: "",
        keywordSourceZipCode: "",
        keywordSourceCountry: "",
        keywordDestinationStreet: "",
        keywordDestinationBuildingNumber: "",
        keywordDestinationApartmentNumber: "",
        keywordDestinationCity: "",
        keywordDestinationZipCode: "",
        keywordDestinationCountry: ""
    });

    const handleNumberChange = <T extends keyof FilteringDetails>(field: T) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = parseFloat(event.target.value);
        setFilteringDetails(prevState => ({
            ...prevState,
            [field]: isNaN(newValue) ? 0 : newValue
        }));
    };

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
          keywordOrderId: "",
          filterStatus: "all",
          minDeliveryAttemptDate: "",
          maxDeliveryAttemptDate: "",
          keywordCannotDeliverReason: "",
          minLastUpdate: "",
          maxLastUpdate: "",
          minPickupDate: "",
          maxPickupDate: "",
          minDeliveryDate: "",
          maxDeliveryDate: "",
          filterPriority: "all",
          filterAtWeekend: "all",
          minVolume: minDefNum,
          maxVolume: maxDefNum,
          minWeight: minDefNum,
          maxWeight: maxDefNum,
          keywordSourceStreet: "",
          keywordSourceBuildingNumber: "",
          keywordSourceApartmentNumber: "",
          keywordSourceCity: "",
          keywordSourceZipCode: "",
          keywordSourceCountry: "",
          keywordDestinationStreet: "",
          keywordDestinationBuildingNumber: "",
          keywordDestinationApartmentNumber: "",
          keywordDestinationCity: "",
          keywordDestinationZipCode: "",
          keywordDestinationCountry: ""
        });
    };

    const submit = async (e: any) => {
      e.preventDefault();
      setError("");
      setIsLoading(true);

      FilterOfferRequests();

      close();
      setIsLoading(false);
    };
  
    const FilterOfferRequests = () => {
      const filteredElements = props.inputData.filter((element : any) =>
        // filtering of id info section
        (filteringDetails.keywordId == "" || element.id.toLowerCase().includes(filteringDetails.keywordId.toLowerCase())) &&
        (filteringDetails.keywordOrderId == "" || element.orderId.toLowerCase().includes(filteringDetails.keywordOrderId.toLowerCase())) &&

        // filtering of status info section
        (filteringDetails.filterStatus == "all" || element.status == filteringDetails.filterStatus) &&
        (filteringDetails.keywordCannotDeliverReason == "" || element.cannotDeliverReason?.toLowerCase().includes(filteringDetails.keywordCannotDeliverReason.toLowerCase())) &&
        
        (filteringDetails.minDeliveryAttemptDate == "" || new Date(dateFromUTCToLocal(element?.deliveryAttemptDate)) >= new Date(filteringDetails.minDeliveryAttemptDate)) &&
        (filteringDetails.maxDeliveryAttemptDate == "" || new Date(dateFromUTCToLocal(element?.deliveryAttemptDate)) <= new Date(filteringDetails.maxDeliveryAttemptDate)) &&

        (filteringDetails.minLastUpdate == "" || new Date(dateFromUTCToLocal(element.lastUpdate)) >= new Date(filteringDetails.minLastUpdate)) &&
        (filteringDetails.maxLastUpdate == "" || new Date(dateFromUTCToLocal(element.lastUpdate)) <= new Date(filteringDetails.maxLastUpdate)) &&

        // filtering of order info section
        (filteringDetails.minPickupDate == "" || new Date(dateFromUTCToLocal(element.pickupDate)) >= new Date(filteringDetails.minPickupDate)) &&
        (filteringDetails.maxPickupDate == "" || new Date(dateFromUTCToLocal(element.pickupDate)) <= new Date(filteringDetails.maxPickupDate)) &&

        (filteringDetails.minDeliveryDate == "" || new Date(dateFromUTCToLocal(element.deliveryDate)) >= new Date(filteringDetails.minDeliveryDate)) &&
        (filteringDetails.maxDeliveryDate == "" || new Date(dateFromUTCToLocal(element.deliveryDate)) <= new Date(filteringDetails.maxDeliveryDate)) &&

        (filteringDetails.filterPriority == "all" || (filteringDetails.filterPriority == element.priority)) &&
        (filteringDetails.filterAtWeekend == "all" || (filteringDetails.filterAtWeekend == booleanToString(element.atWeekend))) &&

        // filtering of package info section
        (filteringDetails.minVolume == null || element.volume >= filteringDetails.minVolume) &&
        (filteringDetails.maxVolume == null || element.volume <= filteringDetails.maxVolume) &&

        (filteringDetails.minWeight == null || element.weight >= filteringDetails.minWeight) &&
        (filteringDetails.maxWeight == null || element.weight <= filteringDetails.maxWeight) &&

        // filtering of source address section
        (filteringDetails.keywordSourceStreet == "" || element.source.street.toLowerCase().includes(filteringDetails.keywordSourceStreet.toLowerCase())) &&
        (filteringDetails.keywordSourceBuildingNumber == "" || element.source.buildingNumber.toLowerCase().includes(filteringDetails.keywordSourceBuildingNumber.toLowerCase())) &&

        (filteringDetails.keywordSourceApartmentNumber == "" || element.source.apartmentNumber.toLowerCase().includes(filteringDetails.keywordSourceApartmentNumber.toLowerCase())) &&
        (filteringDetails.keywordSourceCity == "" || element.source.city.toLowerCase().includes(filteringDetails.keywordSourceCity.toLowerCase())) &&

        (filteringDetails.keywordSourceZipCode == "" || element.source.zipCode.toLowerCase().includes(filteringDetails.keywordSourceZipCode.toLowerCase())) &&
        (filteringDetails.keywordSourceCountry == "" || element.source.country.toLowerCase().includes(filteringDetails.keywordSourceCountry.toLowerCase())) &&

        // filtering of destination address section
        (filteringDetails.keywordDestinationStreet == "" || element.destination.street.toLowerCase().includes(filteringDetails.keywordDestinationStreet.toLowerCase())) &&
        (filteringDetails.keywordDestinationBuildingNumber == "" || element.destination.buildingNumber.toLowerCase().includes(filteringDetails.keywordDestinationBuildingNumber.toLowerCase())) &&

        (filteringDetails.keywordDestinationApartmentNumber == "" || element.destination.apartmentNumber.toLowerCase().includes(filteringDetails.keywordDestinationApartmentNumber.toLowerCase())) &&
        (filteringDetails.keywordDestinationCity == "" || element.destination.city.toLowerCase().includes(filteringDetails.keywordDestinationCity.toLowerCase())) &&

        (filteringDetails.keywordDestinationZipCode == "" || element.destination.zipCode.toLowerCase().includes(filteringDetails.keywordDestinationZipCode.toLowerCase())) &&
        (filteringDetails.keywordDestinationCountry == "" || element.destination.country.toLowerCase().includes(filteringDetails.keywordDestinationCountry.toLowerCase()))
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
                  Filter {props.pageContent == "your-deliveries" ? 'your' : 'pending'} deliveries by attributes:
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

                    <SectionTitle title="Id info" />
                    <IdInfoFilterSection
                        filterData={filteringDetails}
                        handleStringChange={handleStringChange}
                    />
                    <div style={{ marginBottom: '20px' }}></div>

                    <SectionTitle title="Status info" />
                    <StatusInfoFilterSection
                        filterData={filteringDetails}
                        handleStringChange={handleStringChange}
                        handleDateChange={handleDateChange}
                    />
                    <div style={{ marginBottom: '20px' }}></div>

                    <SectionTitle title="Order info" />
                    <OrderInfoFilterSection
                        filterData={filteringDetails}
                        handleDateChange={handleDateChange}
                        handleStringChange={handleStringChange}
                    />
                    <div style={{ marginBottom: '40px' }}></div>

                    <SectionTitle title="Package info" />
                    <PackageInfoFilterSection
                        filterData={filteringDetails}
                        handleNumberChange={handleNumberChange}
                    />
                    <div style={{ marginBottom: '20px' }}></div>

                    <SectionTitle title="Source address" />
                    <AddressFilterSection
                        prefix="Source"
                        filterData={filteringDetails}
                        handleStringChange={handleStringChange}
                    />
                    <div style={{ marginBottom: '20px' }}></div>

                    <SectionTitle title="Destination address" />
                    <AddressFilterSection
                        prefix="Destination"
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
  