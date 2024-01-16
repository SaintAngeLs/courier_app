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
  import { isPackageValid } from "../../details/inquiry";
  import dateFromUTCToLocal from "../../parsing/dateFromUTCToLocal";
  import booleanToString from "../../parsing/booleanToString";
  
  interface FilterInquiriesModalProps {
    show: boolean;
    setShow: (show: boolean) => void;
    inputData: any;
    tableData: any;
    setTableData: any;
    role: string;
  }
  
  type FilteringDetails = {
    patternId: string;
    patternDescription: string;
    minWidth: number;
    maxWidth: number;
    minHeight: number;
    maxHeight: number;
    minDepth: number;
    maxDepth: number;
    minWeight: number;
    maxWeight: number;
    patternSourceStreet: string;
    patternSourceBuildingNumber: string;
    patternSourceApartmentNumber: string;
    patternSourceCity: string;
    patternSourceZipCode: string;
    patternSourceCountry: string;
    patternDestinationStreet: string;
    patternDestinationBuildingNumber: string;
    patternDestinationApartmentNumber: string;
    patternDestinationCity: string;
    patternDestinationZipCode: string;
    patternDestinationCountry: string;
    minDateOfInquiring: string;
    maxDateOfInquiring: string;
    minPickupDate: string;
    maxPickupDate: string;
    minDeliveryDate: string;
    maxDeliveryDate: string;
    filterStatus: string;
    filterPriority: string;
    filterAtWeekend: string;
    filterIsCompany: string;
    filterVipPackage: string;
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

  const IdFilterSection = ({ filterData, handleStringChange, role }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInputWithLabel
            id="id-pattern"
            label="Pattern contained in inquiry id:"
            type="text"
            value={filterData.patternId}
            onChange={handleStringChange('patternId')}
        />
        {(role === "officeworker") ?
          <TextInputWithLabel
              id="customer-id-pattern"
              label="Pattern contained in customer id:"
              type="text"
              value={filterData.patternId}
              onChange={handleStringChange('patternId')}
          />
        : null }
        <TextInputWithLabel
            id="description-pattern"
            label="Pattern contained in description:"
            type="text"
            value={filterData.patternDescription}
            onChange={handleStringChange('patternDescription')}
        />
    </div>
  );

  const DimensionsFilterSection = ({ filterData, handleNumberChange }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInputWithLabel
            id="width-min"
            label="Minimum width:"
            type="number"
            value={filterData.minWidth}
            onChange={handleNumberChange('minWidth')}
        />
        <TextInputWithLabel
            id="width-max"
            label="Maximum width:"
            type="number"
            value={filterData.maxWidth}
            onChange={handleNumberChange('maxWidth')}
        />

        <TextInputWithLabel
            id="height-min"
            label="Minimum height:"
            type="number"
            value={filterData.minHeight}
            onChange={handleNumberChange('minHeight')}
        />
        <TextInputWithLabel
            id="height-max"
            label="Maximum height:"
            type="number"
            value={filterData.maxHeight}
            onChange={handleNumberChange('maxHeight')}
        />

        <TextInputWithLabel
            id="depth-min"
            label="Minimum depth:"
            type="number"
            value={filterData.minDepth}
            onChange={handleNumberChange('minDepth')}
        />
        <TextInputWithLabel
            id="depth-max"
            label="Maximum depth:"
            type="number"
            value={filterData.maxDepth}
            onChange={handleNumberChange('maxDepth')}
        />
    </div>
  );

  const WeightFilterSection = ({ filterData, handleNumberChange }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            id={`${prefix}-street-pattern`}
            label={`Pattern contained in street:`}
            type="text"
            value={filterData[`pattern${prefix}Street`]}
            onChange={handleStringChange(`pattern${prefix}Street`)} 
        />
        <TextInputWithLabel
            id={`${prefix}-building-number-pattern`}
            label={`Pattern contained in building number:`}
            type="text"
            value={filterData[`pattern${prefix}BuildingNumber`]}
            onChange={handleStringChange(`pattern${prefix}BuildingNumber`)} 
        />

        <TextInputWithLabel
            id={`${prefix}-apartment-number-pattern`}
            label={`Pattern contained in apartment number:`}
            type="text"
            value={filterData[`pattern${prefix}ApartmentNumber`]}
            onChange={handleStringChange(`pattern${prefix}ApartmentNumber`)} 
        />
        <TextInputWithLabel
            id={`${prefix}-city-pattern`}
            label={`Pattern contained in city:`}
            type="text"
            value={filterData[`pattern${prefix}City`]}
            onChange={handleStringChange(`pattern${prefix}City`)} 
        />

        <TextInputWithLabel
            id={`${prefix}-zip-code-pattern`}
            label={`Pattern contained in zip code:`}
            type="text"
            value={filterData[`pattern${prefix}ZipCode`]}
            onChange={handleStringChange(`pattern${prefix}ZipCode`)} 
        />
        <TextInputWithLabel
            id={`${prefix}-city-pattern`}
            label={`Pattern contained in country:`}
            type="text"
            value={filterData[`pattern${prefix}Country`]}
            onChange={handleStringChange(`pattern${prefix}Country`)} 
        />
    </div>
  );

  const DateOfInquiringFilterSection = ({ filterData, handleDateChange }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DateInputWithLabel
            id="date-of-inquiring-min"
            label="From:"
            value={filterData.minDateOfInquiring}
            onChange={handleDateChange('minDateOfInquiring')}
        />
        <DateInputWithLabel
            id="date-of-inquiring-max"
            label="To:"
            value={filterData.maxDateOfInquiring}
            onChange={handleDateChange('maxDateOfInquiring')}
        />
    </div>
  );

  const PickupDateFilterSection = ({ filterData, handleDateChange }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DateInputWithLabel
            id="pickup-date-min"
            label="From:"
            value={filterData.minPickupDate}
            onChange={handleDateChange('minPickupDate')}
        />
        <DateInputWithLabel
            id="pickup-date-max"
            label="To:"
            value={filterData.maxPickupDate}
            onChange={handleDateChange('maxPickupDate')}
        />
    </div>
  );

  const DeliveryDateFilterSection = ({ filterData, handleDateChange }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DateInputWithLabel
            id="delivery-date-min"
            label="From:"
            value={filterData.minDeliveryDate}
            onChange={handleDateChange('minDeliveryDate')}
        />
        <DateInputWithLabel
            id="delivery-date-max"
            label="To:"
            value={filterData.maxDeliveryDate}
            onChange={handleDateChange('maxDeliveryDate')}
        />
    </div>
  );

  const StatusFilterSection = ({ filterData, handleStringChange }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <select
            id="filter-status"
            value={filterData.filterStatus}
            onChange={handleStringChange('filterStatus')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
            <option value="all">all</option>
            <option value="expired">expired</option>
            <option value="valid">valid</option>
        </select>
    </div>
  );

  const AdditionalInfoFilterSection = ({ filterData, handleStringChange }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        <div>
          <Label htmlFor="filter-is-company" className="mb-2 block text-sm font-medium text-gray-700">Is company:</Label>
          <select
              id="filter-is-company"
              value={filterData.filterIsCompany}
              onChange={handleStringChange('filterIsCompany')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
              <option value="all">all</option>
              <option value="true">yes</option>
              <option value="false">no</option>
          </select>
        </div>

        <div>
          <Label htmlFor="filter-vip-package" className="mb-2 block text-sm font-medium text-gray-700">Vip package:</Label>
          <select
              id="filter-vip-package"
              value={filterData.filterVipPackage}
              onChange={handleStringChange('filterVipPackage')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
              <option value="all">all</option>
              <option value="true">yes</option>
              <option value="false">no</option>
          </select>
        </div>
    </div>
  );

  export function FilterInquiriesModal(props: FilterInquiriesModalProps) {
    const close = () => {
      setError("");
      setIsLoading(false);
      props.setShow(false);
    };

    const minDefNum = 0;
    const maxDefNum = 99999;

    const [filteringDetails, setFilteringDetails] = React.useState<FilteringDetails>({
        patternId: "",
        patternDescription: "",
        minWidth: minDefNum,
        maxWidth: maxDefNum,
        minHeight: minDefNum,
        maxHeight: maxDefNum,
        minDepth: minDefNum,
        maxDepth: maxDefNum,
        minWeight: minDefNum,
        maxWeight: maxDefNum,
        patternSourceStreet: "",
        patternSourceBuildingNumber: "",
        patternSourceApartmentNumber: "",
        patternSourceCity: "",
        patternSourceZipCode: "",
        patternSourceCountry: "",
        patternDestinationStreet: "",
        patternDestinationBuildingNumber: "",
        patternDestinationApartmentNumber: "",
        patternDestinationCity: "",
        patternDestinationZipCode: "",
        patternDestinationCountry: "",
        minDateOfInquiring: "",
        maxDateOfInquiring: "",
        minPickupDate: "",
        maxPickupDate: "",
        minDeliveryDate: "",
        maxDeliveryDate: "",
        filterStatus: "all",
        filterPriority: "all",
        filterAtWeekend: "all",
        filterIsCompany: "all",
        filterVipPackage: "all"
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
            patternId: "",
            patternDescription: "",
            minWidth: minDefNum,
            maxWidth: maxDefNum,
            minHeight: minDefNum,
            maxHeight: maxDefNum,
            minDepth: minDefNum,
            maxDepth: maxDefNum,
            minWeight: minDefNum,
            maxWeight: maxDefNum,
            patternSourceStreet: "",
            patternSourceBuildingNumber: "",
            patternSourceApartmentNumber: "",
            patternSourceCity: "",
            patternSourceZipCode: "",
            patternSourceCountry: "",
            patternDestinationStreet: "",
            patternDestinationBuildingNumber: "",
            patternDestinationApartmentNumber: "",
            patternDestinationCity: "",
            patternDestinationZipCode: "",
            patternDestinationCountry: "",
            minDateOfInquiring: "",
            maxDateOfInquiring: "",
            minPickupDate: "",
            maxPickupDate: "",
            minDeliveryDate: "",
            maxDeliveryDate: "",
            filterStatus: "all",
            filterPriority: "all",
            filterAtWeekend: "all",
            filterIsCompany: "all",
            filterVipPackage: "all"
        });
    };

    const submit = async (e: any) => {
      e.preventDefault();
      setError("");
      setIsLoading(true);

      filterInquiries();

      close();
      setIsLoading(false);
    };
  
    const filterInquiries = () => {
      const filteredElements = props.inputData.filter((element : any) =>
        // filtering of id section
        (filteringDetails.patternId == "" || element.id.includes(filteringDetails.patternId)) &&
        (filteringDetails.patternDescription == "" || element.description.includes(filteringDetails.patternDescription)) &&

        // filtering of dimensions section
        (filteringDetails.minWidth == null || element.width >= filteringDetails.minWidth) &&
        (filteringDetails.maxWidth == null || element.width <= filteringDetails.maxWidth) &&

        (filteringDetails.minHeight == null || element.height >= filteringDetails.minHeight) &&
        (filteringDetails.maxHeight == null || element.height <= filteringDetails.maxHeight) &&

        (filteringDetails.minDepth == null || element.depth >= filteringDetails.minDepth) &&
        (filteringDetails.maxDepth == null || element.depth <= filteringDetails.maxDepth) &&

        // filtering of weight section
        (filteringDetails.minWeight == null || element.weight >= filteringDetails.minWeight) &&
        (filteringDetails.maxWeight == null || element.weight <= filteringDetails.maxWeight) &&

        // filtering of source address section
        (filteringDetails.patternSourceStreet == "" || element.source.street.includes(filteringDetails.patternSourceStreet)) &&
        (filteringDetails.patternSourceBuildingNumber == "" || element.source.buildingNumber.includes(filteringDetails.patternSourceBuildingNumber)) &&

        (filteringDetails.patternSourceApartmentNumber == "" || element.source.apartmentNumber.includes(filteringDetails.patternSourceApartmentNumber)) &&
        (filteringDetails.patternSourceCity == "" || element.source.city.includes(filteringDetails.patternSourceCity)) &&

        (filteringDetails.patternSourceZipCode == "" || element.source.zipCode.includes(filteringDetails.patternSourceZipCode)) &&
        (filteringDetails.patternSourceCountry == "" || element.source.country.includes(filteringDetails.patternSourceCountry)) &&

        // filtering of destination address section
        (filteringDetails.patternDestinationStreet == "" || element.destination.street.includes(filteringDetails.patternDestinationStreet)) &&
        (filteringDetails.patternDestinationBuildingNumber == "" || element.destination.buildingNumber.includes(filteringDetails.patternDestinationBuildingNumber)) &&

        (filteringDetails.patternDestinationApartmentNumber == "" || element.destination.apartmentNumber.includes(filteringDetails.patternDestinationApartmentNumber)) &&
        (filteringDetails.patternDestinationCity == "" || element.destination.city.includes(filteringDetails.patternDestinationCity)) &&

        (filteringDetails.patternDestinationZipCode == "" || element.destination.zipCode.includes(filteringDetails.patternDestinationZipCode)) &&
        (filteringDetails.patternDestinationCountry == "" || element.destination.country.includes(filteringDetails.patternDestinationCountry)) &&

        // filtering of date of inquiring
        (filteringDetails.minDateOfInquiring == "" || new Date(dateFromUTCToLocal(element.createdAt)) >= new Date(filteringDetails.minDateOfInquiring)) &&
        (filteringDetails.maxDateOfInquiring == "" || new Date(dateFromUTCToLocal(element.createdAt)) <= new Date(filteringDetails.maxDateOfInquiring)) &&

        // filtering of pickup date
        (filteringDetails.minPickupDate == "" || new Date(dateFromUTCToLocal(element.pickupDate)) >= new Date(filteringDetails.minPickupDate)) &&
        (filteringDetails.maxPickupDate == "" || new Date(dateFromUTCToLocal(element.pickupDate)) <= new Date(filteringDetails.maxPickupDate)) &&

        // filtering of delivery date
        (filteringDetails.minDeliveryDate == "" || new Date(dateFromUTCToLocal(element.deliveryDate)) >= new Date(filteringDetails.minDeliveryDate)) &&
        (filteringDetails.maxDeliveryDate == "" || new Date(dateFromUTCToLocal(element.deliveryDate)) <= new Date(filteringDetails.maxDeliveryDate)) &&

        // filtering of status
        (filteringDetails.filterStatus != "expired" || isPackageValid(element.validTo) == false) &&
        (filteringDetails.filterStatus != "valid" || isPackageValid(element.validTo) == true) &&

        // filtering of additional info
        (filteringDetails.filterPriority == "all" || (filteringDetails.filterPriority == element.priority)) &&
        (filteringDetails.filterAtWeekend == "all" || (filteringDetails.filterAtWeekend == booleanToString(element.atWeekend))) &&
        (filteringDetails.filterIsCompany == "all" || (filteringDetails.filterIsCompany == booleanToString(element.isCompany))) &&
        (filteringDetails.filterVipPackage == "all" || (filteringDetails.filterVipPackage == booleanToString(element.vipPackage)))
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
                  Filter inquiries by attributes:
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

                    <SectionTitle title="Id" />
                    <IdFilterSection
                        filterData={filteringDetails}
                        handleStringChange={handleStringChange}
                        role={props.role}
                    />

                    <SectionTitle title="Package dimensions" />
                    <DimensionsFilterSection
                        filterData={filteringDetails}
                        handleNumberChange={handleNumberChange}
                    />

                    <SectionTitle title="Package weight" />
                    <WeightFilterSection
                        filterData={filteringDetails}
                        handleNumberChange={handleNumberChange}
                    />

                    <SectionTitle title="Source address" />
                    <AddressFilterSection
                        prefix="Source"
                        filterData={filteringDetails}
                        handleStringChange={handleStringChange}
                    />

                    <SectionTitle title="Destination address" />
                    <AddressFilterSection
                        prefix="Destination"
                        filterData={filteringDetails}
                        handleStringChange={handleStringChange}
                    />

                    <SectionTitle title="Date of inquiring" />
                    <DateOfInquiringFilterSection
                        filterData={filteringDetails}
                        handleDateChange={handleDateChange}
                    />

                    <SectionTitle title="Pickup date" />
                    <PickupDateFilterSection
                        filterData={filteringDetails}
                        handleDateChange={handleDateChange}
                    />

                    <SectionTitle title="Delivery date" />
                    <DeliveryDateFilterSection
                        filterData={filteringDetails}
                        handleDateChange={handleDateChange}
                    />

                    <SectionTitle title="Status" />
                    <StatusFilterSection
                        filterData={filteringDetails}
                        handleStringChange={handleStringChange}
                    />

                    <div style={{ marginBottom: '20px' }}></div>

                    <SectionTitle title="Additional info" />
                    <AdditionalInfoFilterSection
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
  