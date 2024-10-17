import {
    Alert,
    Button,
    Checkbox,
    Label,
    Spinner,
    TextInput,
  } from "flowbite-react";
  import React from "react";
  import { HiCheckCircle } from "react-icons/hi";
  import { Footer } from "../../components/footer";
  import { Header } from "../../components/header";
  import { Loader } from "../../components/loader";
  import { createInquiry } from "../../utils/api";
import stringToBoolean from "../../components/parsing/stringToBoolean";
import booleanToString from "../../components/parsing/booleanToString";
import { CourierOffers } from "../couriers/courierOffers";
import { useNavigate } from "react-router-dom";
import { getUserIdFromStorage } from "../../utils/storage";


type FormFields = {
    description: string;
    packageWidth: number;
    packageHeight: number;
    packageDepth: number;
    packageWeight: number;
    sourceAddressStreet: string;
    sourceAddressBuildingNumber: string;
    sourceAddressApartmentNumber: string;
    sourceAddressCity: string;
    sourceAddressZipCode: string;
    sourceAddressCountry: string;
    destinationAddressStreet: string;
    destinationAddressBuildingNumber: string;
    destinationAddressApartmentNumber: string;
    destinationAddressCity: string;
    destinationAddressZipCode: string;
    destinationAddressCountry: string;
    pickupDate: string;
    deliveryDate: string;
    priority: string;
    atWeekend: boolean;
    isCompany: boolean;
    vipPackage: boolean;
};
  

type FormErrors = {
    [K in keyof FormFields]?: string;
};

const TextInputWithLabel = ({ id, label, value, onChange, type,  error }) => (
    <div className="mb-4 flex flex-col">
      <Label htmlFor={id} className="mb-2 block text-sm font-medium text-gray-700">{label}</Label>
      <TextInput 
        id={id} 
        type={type}
        lang="en"
        value={value} 
        onChange={(e) => onChange(e)}
        className={`border-gray-300 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm rounded-md ${error ? 'border-red-500' : ''}`}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
);

  
const DateInputWithLabel = ({ id, label, value, onChange, error }) => {
    // Function to format the date to MongoDB format
    const formatToMongoDBDate = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString();
    };

    // Function to handle date change
    const handleDateChange = (e) => {
        const formattedDate = formatToMongoDBDate(e.target.value);
        console.log("FormattedDate is: ...", formattedDate)
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
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
};

  
const SectionTitle = ({ title }) => (
    <div className="mb-4 border-b border-gray-300 pb-1">
      <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
    </div>
);

const Alerts = ({ error, success }) => (
    <>
        {error && <Alert color="failure">{error}</Alert>}
        {success && <Alert color="success">{success}</Alert>}
    </>
);


const SubmitButton = ({ inquiryLoading }) => (
    <div className="flex justify-end">
        <Button type="submit" disabled={inquiryLoading}>
            {inquiryLoading ? <Spinner /> : "Create new inquiry"}
        </Button>
    </div>
);

const ShortDescriptionSection = ({ formFields, handleDescriptionChange, errors }) => (
    <div className="my-5">
        <TextInputWithLabel
            id="description"
            label="Short Description"
            value={formFields.description}
            onChange={handleDescriptionChange('description')}
            type="text" 
            error={errors.description}
        />
    </div>
);
  
const PackageDetailsSection = ({ formFields, handleNumberChange, errors }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInputWithLabel
            id="package-width" 
            label="Width" 
            value={formFields.packageWidth} 
            onChange={handleNumberChange('packageWidth')} 
            type="number" 
            error={errors.packageWidth}
        />
        <TextInputWithLabel 
            id="package-height" 
            label="Height" 
            value={formFields.packageHeight} 
            onChange={handleNumberChange('packageHeight')}  
            type="number" 
            error={errors.packageHeight}
        />
        <TextInputWithLabel 
            id="package-depth" 
            label="Depth" 
            value={formFields.packageDepth} 
            onChange={handleNumberChange('packageDepth')} 
            type="number" 
            error={errors.packageDepth}
        />
        <TextInputWithLabel
            id="package-weight"
            label="Weight" 
            value={formFields.packageWeight} 
            onChange={handleNumberChange('packageWeight')} 
            type="number"
            error={errors.packageWeight}
        />
    </div>
);

const DeliveryDetailsSection = ({ formFields, handleDateChange, handlePriorityChange, handleBooleanChange, errors }) => (
    <div className="grid grid-cols-2 gap-4">
        {/* Other inputs for priority, atWeekend, isCompany, vipPackage */}

        <DateInputWithLabel
            id="pickup-date"
            label="Pickup Date"
            value={formFields.pickupDate}
            onChange={handleDateChange('pickupDate')}
            error={errors.pickupDate}
        />
        <DateInputWithLabel
            id="delivery-date"
            label="Delivery Date"
            value={formFields.deliveryDate}
            onChange={handleDateChange('deliveryDate')}
            error={errors.deliveryDate}
        />

        <div className="col-span-2 grid grid-cols-4 gap-4">
        <div>
            <Label htmlFor="priority">Priority</Label>
            <select 
                id="priority"
                value={formFields.priority}
                onChange={handlePriorityChange('priority')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
                <option value="Low">Low</option>
                <option value="High">High</option>
            </select>
        </div>

        <div>
            <Label htmlFor="at-weekend">Delivery at Weekend</Label>
            <select
                id="at-weekend"
                value={formFields.atWeekend}
                onChange={handleBooleanChange('atWeekend')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
                <option value="false">No</option>
                <option value="true">Yes</option>
            </select>
        </div>

        <div>
            <Label htmlFor="is-company">Created by Company</Label>
            <select
                id="is-company"
                value={formFields.isCompany}
                onChange={handleBooleanChange('isCompany')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
                <option value="false">No</option>
                <option value="true">Yes</option>
            </select>
        </div>

        <div>
            <Label htmlFor="vip-package">VIP Delivery</Label>
            <select
                id="vip-package"
                value={formFields.vipPackage}
                onChange={handleBooleanChange('vipPackage')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
                <option value="false">No</option>
                <option value="true">Yes</option>
            </select>
        </div>
    </div>

    </div>
);

const AddressSection = ({ prefix, formFields, handleStringChange, errors}) => (
    <div className="grid grid-cols-2 gap-4">
        <TextInputWithLabel 
            id={`${prefix}-address-street`} 
            label="Street" 
            value={formFields[`${prefix}AddressStreet`]} 
            onChange={handleStringChange(`${prefix}AddressStreet`)} 
            type="text" 
            error={errors[`${prefix}AddressStreet`]}
        />
        <TextInputWithLabel 
            id={`${prefix}-address-building-number`} 
            label="Building Number" 
            value={formFields[`${prefix}AddressBuildingNumber`]} 
            onChange={handleStringChange(`${prefix}AddressBuildingNumber`)} 
            type="text" 
            error={errors[`${prefix}AddressBuildingNumber`]}
        />
        <TextInputWithLabel 
            id={`${prefix}-address-apartment-number`} 
            label="Apartment Number (optional)" 
            value={formFields[`${prefix}AddressApartmentNumber`]} 
            onChange={handleStringChange(`${prefix}AddressApartmentNumber`)} 
            type="text" 
            error={errors[`${prefix}AddressApartmentNumber`]}
        />
        <TextInputWithLabel 
            id={`${prefix}-address-city`} 
            label="City" 
            value={formFields[`${prefix}AddressCity`]} 
            onChange={handleStringChange(`${prefix}AddressCity`)} 
            type="text" 
            error={errors[`${prefix}AddressCity`]}
        />
        <TextInputWithLabel 
            id={`${prefix}-address-zip-code`} 
            label="Zip Code" 
            value={formFields[`${prefix}AddressZipCode`]} 
            onChange={handleStringChange(`${prefix}AddressZipCode`)} 
            type="text" 
            error={errors[`${prefix}AddressZipCode`]}
        />
        <TextInputWithLabel 
            id={`${prefix}-address-country`} 
            label="Country" 
            value={formFields[`${prefix}AddressCountry`]} 
            onChange={handleStringChange(`${prefix}AddressCountry`)} 
            type="text" 
            error={errors[`${prefix}AddressCountry`]}
        />
    </div>
);


export default function CreateInquiry() {
    const [showLoginModal, setShowLoginModal] = React.useState(true);
    const [loading, setLoading] = React.useState(true);
    const [formIsValid, setFormIsValid] = React.useState(true); 

    // const [formFields, setFormFields] = React.useState<FormFields>({
    //     description: "",
    //     packageWidth: 0,
    //     packageHeight: 0,
    //     packageDepth: 0,
    //     packageWeight: 0,
    //     sourceAddressStreet: "",
    //     sourceAddressBuildingNumber: "",
    //     sourceAddressApartmentNumber: "",
    //     sourceAddressCity: "",
    //     sourceAddressZipCode: "",
    //     sourceAddressCountry: "",
    //     destinationAddressStreet: "",
    //     destinationAddressBuildingNumber: "",
    //     destinationAddressApartmentNumber: "",
    //     destinationAddressCity: "",
    //     destinationAddressZipCode: "",
    //     destinationAddressCountry: "",
    //     pickupDate: "",
    //     deliveryDate: "",
    //     priority: "Low",
    //     atWeekend: false,
    //     isCompany: false,
    //     vipPackage: false
    // });


    const [formFields, setFormFields] = React.useState<FormFields>({
        description: "sin",
        packageWidth: 1,
        packageHeight: 0.5,
        packageDepth: 0.5,
        packageWeight: 0.5,
        sourceAddressStreet: "Plac politechniki",
        sourceAddressBuildingNumber: "1",
        sourceAddressApartmentNumber: "31",
        sourceAddressCity: "Warszawa",
        sourceAddressZipCode: "00-420",
        sourceAddressCountry: "Polska",
        destinationAddressStreet: "Koszykowa",
        destinationAddressBuildingNumber: "21",
        destinationAddressApartmentNumber: "37",
        destinationAddressCity: "Warszawa",
        destinationAddressZipCode: "00-420",
        destinationAddressCountry: "Polska",
        pickupDate: "2024-01-21", // Format this as per your requirement
        deliveryDate: "2024-01-30", // Format this as per your requirement
        priority: "High",
        atWeekend: true,
        isCompany: true,
        vipPackage: true
    });
    
    
    const handleNumberChange = <T extends keyof FormFields>(field: T) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = parseFloat(event.target.value);
        setFormFields(prevState => ({
            ...prevState,
            [field]: isNaN(newValue) ? 0 : newValue
        }));
    };

    const handleStringChange = <T extends keyof FormFields>(field: T) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        setFormFields(prevState => ({
            ...prevState,
            [field]: newValue
        }));
    };

    const handleDateChange = <T extends keyof FormFields>(field: T) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event;
        setFormFields(prevState => ({
            ...prevState,
            [field]: newValue
        }));
    };

    const handlePriorityChange = <T extends keyof FormFields>(field: T) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        setFormFields(prevState => ({
            ...prevState,
            [field]: newValue
        }));
    };

    const handleBooleanChange = <T extends keyof FormFields>(field: T) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = stringToBoolean(event.target.value);
        setFormFields(prevState => ({
            ...prevState,
            [field]: newValue
        }));
    };

    const [formErrors, setFormErrors] = React.useState<FormErrors>({});

    const [offers, setOffers] = React.useState(null);
    const [showOffers, setShowOffers] = React.useState(false); // New state to control display

    const formatDateForServer = (dateString) => {
        return new Date(dateString).toISOString(); // Adjust this based on server's expected format
    };

    const [error, setError] = React.useState("");
    const [success, setSuccess] = React.useState("");
  
    const [inquiryLoading, setInquiryLoading] = React.useState(false);

    const navigate = useNavigate();

    const validateForm = () => {
        const errors: FormErrors = {};

        // validation of description section

        if (!formFields.description) {
            errors.description = "Short description is required!";
        }

        // validation of package details section

        if (formFields.packageWidth <= 0.2 || formFields.packageWidth >= 8) {
            errors.packageWidth = "Width must be greater than 0.2 meters and less than 8 meters!";
        }

        if (formFields.packageHeight <= 0.2 || formFields.packageHeight >= 8) {
            errors.packageHeight = "Height must be greater than 0.2 meters and less than 8 meters!";
        }
    
        if (formFields.packageDepth <= 0.2 || formFields.packageHeight >= 8) {
            errors.packageDepth = "Depth must be greater than 0.2 meters and less than 8 meters!";
        }

        if (formFields.packageWeight <= 0.2 || formFields.packageWeight >= 8) {
            errors.packageWeight = "Weight must be greater than 0.2 meters and less than 8 meters!";
        }

        // validation of source address section

        if (!formFields.sourceAddressStreet) {
            errors.sourceAddressStreet = "Street in source address is required!";
        }

        if (!formFields.sourceAddressBuildingNumber) {
            errors.sourceAddressBuildingNumber = "Building number in source address is required!";
        }

        if (!formFields.sourceAddressCity) {
            errors.sourceAddressCity = "City in source address is required!";
        }

        if (!formFields.sourceAddressZipCode) {
            errors.sourceAddressZipCode = "Zip code in source address is required!";
        }

        if (!formFields.sourceAddressCountry) {
            errors.sourceAddressCountry = "Country in source address is required!";
        }

        // validation of destination address section

        if (!formFields.destinationAddressStreet) {
            errors.destinationAddressStreet = "Street in destination address is required!";
        }

        if (!formFields.destinationAddressBuildingNumber) {
            errors.destinationAddressBuildingNumber = "Building number in destination address is required!";
        }

        if (!formFields.destinationAddressCity) {
            errors.destinationAddressCity = "City in destination address is required!";
        }

        if (!formFields.destinationAddressZipCode) {
            errors.destinationAddressZipCode = "Zip code in destination address is required!";
        }

        if (!formFields.destinationAddressCountry) {
            errors.destinationAddressCountry = "Country in destination address is required!";
        }

        // validation of pickup date and delivery date

        const currentDate = new Date();
        const pickupDate = new Date(formFields.pickupDate);
        const deliveryDate = new Date(formFields.deliveryDate);

        if (currentDate >= pickupDate)
        {
            errors.pickupDate = "Pickup date must be later than current date!";
        }

        if (pickupDate >= deliveryDate)
        {
            errors.deliveryDate = "Delivery date must be later than pickup date!";
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0; 
      };

    const handleSelectOffer = (offer) => {
        // Logic to proceed with the selected offer
        console.log("Selected Offer: ", offer);
        // Additional logic here
    };

    const onSubmit = (e: any) => {
      e.preventDefault();

      const isFormValid = validateForm();
      setFormIsValid(isFormValid);

      if (!isFormValid) {
         return;
      }

      if (inquiryLoading) return;
      setError("");
      setSuccess("");
      setInquiryLoading(true);

      createInquiry(
        getUserIdFromStorage(),
        formFields.description,
        formFields.packageWidth,
        formFields.packageHeight,
        formFields.packageDepth,
        formFields.packageWeight,
        formFields.sourceAddressStreet,
        formFields.sourceAddressBuildingNumber,
        formFields.sourceAddressApartmentNumber,
        formFields.sourceAddressCity,
        formFields.sourceAddressZipCode,
        formFields.sourceAddressCountry,
        formFields.destinationAddressStreet,
        formFields.destinationAddressBuildingNumber,
        formFields.destinationAddressApartmentNumber,
        formFields.destinationAddressCity,
        formFields.destinationAddressZipCode,
        formFields.destinationAddressCountry,
        formFields.priority,
        formFields.atWeekend,
        formatDateForServer(formFields.pickupDate),
        formatDateForServer(formFields.deliveryDate),
        formFields.isCompany,
        formFields.vipPackage)
        .then((response) => {
          setSuccess("Inquiry created successfully!");
          setFormFields(
          {
            description: "",
            packageWidth: 0,
            packageHeight: 0,
            packageDepth: 0,
            packageWeight: 0,
            sourceAddressStreet: "",
            sourceAddressBuildingNumber: "",
            sourceAddressApartmentNumber: "",
            sourceAddressCity: "",
            sourceAddressZipCode: "",
            sourceAddressCountry: "",
            destinationAddressStreet: "",
            destinationAddressBuildingNumber: "",
            destinationAddressApartmentNumber: "",
            destinationAddressCity: "",
            destinationAddressZipCode: "",
            destinationAddressCountry: "",
            pickupDate: "",
            deliveryDate: "",
            priority: "Low",
            atWeekend: false,
            isCompany: false,
            vipPackage: false
        });

        navigate("/offers", {state: {parcelId: response}});

        //   setOffers(offers);
        //   if (offers && offers.length > 0) {
        //     setShowOffers(true); // Show offers if available
        //   } else {
        //     setShowOffers(false); // Hide offers if none are available
        //   }
        //   if (offers) {
        //     // TODO: Implement logic to display the offers
        //   }
        })

        .catch((err) => {
          setError(err?.response?.data?.reason || "Something went wrong!");
        })
        .finally(() => {
          setInquiryLoading(false);
        });
    };
  
    // const clickSeeOffers = (data) => {
    //     navigate.push("/offers", {data: data});  
    // }

    return (
      <>
        {loading ? <Loader /> : null}

        {showOffers ? (
          <>
            <h2 className="text-2xl font-bold mb-4">Select a Courier Offer</h2>
            <CourierOffers offers={offers} onSelectOffer={handleSelectOffer} />
          </>
        ) : (
        <div className="container mx-auto px-4">
          <Header
            loading={loading}
            setLoading={setLoading}
            showLoginModal={showLoginModal}
            setShowLoginModal={setShowLoginModal}
          />
          <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
            Create an inquiry
          </h1>
          <p className="mb-5">
            Please fill all fields below and click blue button located at the bottom of this page.
          </p>

          <form className="flex flex-col gap-6 px-10" onSubmit={onSubmit}>

            <div className=" gap-6">

                <SectionTitle title="Package Details" />

                <PackageDetailsSection
                    formFields={formFields}
                    handleNumberChange={handleNumberChange}
                    errors={formErrors} />
                
                <SectionTitle title="Source Address" />

                <AddressSection 
                    prefix="source" 
                    formFields={formFields}
                    handleStringChange={handleStringChange}
                    errors={formErrors}
                />

                <SectionTitle title="Destination Address" />
                <AddressSection 
                    prefix="destination" 
                    formFields={formFields}
                    handleStringChange={handleStringChange}
                    errors={formErrors}
                />

                <SectionTitle title="Delivery Details" />
                <DeliveryDetailsSection
                    formFields={formFields}
                    handleDateChange={handleDateChange}
                    handlePriorityChange={handlePriorityChange}
                    handleBooleanChange={handleBooleanChange}
                    errors={formErrors}
                />

                <ShortDescriptionSection
                    formFields={formFields}
                    handleDescriptionChange={handleStringChange}
                    errors={formErrors}
                />

                {!formIsValid && <p className="text-red-500">Please fill in all required fields.</p>}

                <Alerts error={error} success={success} />

                <SubmitButton inquiryLoading={inquiryLoading} />
                
                </div>
          </form>
          {success ? (
            <div>
            <Alert color="success" icon={HiCheckCircle} className="mb-3">
              <span>
                <span className="font-bold">Success!</span> {success}
              </span>
              <CourierOffers offers={offers} onSelectOffer={handleSelectOffer} />
            </Alert>
            </div>
          ) : null}
          <Footer />
        </div>
        )}
      </>
    
    );
  }
  