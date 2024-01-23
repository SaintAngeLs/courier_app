import {
    Alert,
    Button,
    Label,
    Modal,
    TextInput,
    Spinner
  } from "flowbite-react";
  import React from "react";
  import { HiCheckCircle } from "react-icons/hi";
  import { useNavigate } from "react-router-dom";
  import { createOrder } from "../../../utils/api";
  
  interface UserDetailsModalProps {
    show: boolean;
    setShow: (show: boolean) => void;
    userId: any;
    offer: any;
    userData: any;
  }

  type UserInfo = {
    name: string;
    email: string;
    addressStreet: string;
    addressBuildingNumber: string;
    addressApartmentNumber: string;
    addressCity: string;
    addressZipCode: string;
    addressCountry: string;
  };

  type UserInfoErrors = {
    [K in keyof UserInfo]?: string;
  };

  const SectionTitle = ({ title }) => (
    <div className="mb-4 border-b border-gray-400 pb-1">
      <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
    </div>
  );

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

  const Alerts = ({ error, success }) => (
    <>
        {error && <Alert color="failure">{error}</Alert>}
        {success && <Alert color="success">{success}</Alert>}
    </>
  );

  const SubmitButton = ({ userInfoLoading }) => (
      <div className="flex justify-end">
          <Button type="submit" disabled={userInfoLoading}>
              {userInfoLoading ? <Spinner /> : "Submit the offer"}
          </Button>
      </div>
  );

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

  const PriceBreakDownElement = ({ element }) => (
    <LabelsWithBorder
      idA="elementName"
      valueA={`${element.description}:`}
      idB="elementValue"
      valueB={`${element.amount} ${element.currency}`}
    />
  );

  const BasicInfoSection = ({ userData, handleStringChange, errors }) => (
    <div>
        <TextInputWithLabel
            id="name"
            label="Your name:"
            value={userData.name}
            onChange={handleStringChange('name')}
            type="text" 
            error={errors.name}
        />
        <TextInputWithLabel
            id="name"
            label="Your email:"
            value={userData.email}
            onChange={handleStringChange('email')}
            type="email" 
            error={errors.email}
        />
    </div>
  );

  const AddressSection = ({ userData, handleStringChange, errors }) => (
    <div className="grid grid-cols-2 gap-4">
        <TextInputWithLabel 
            id={`address-street`} 
            label="Street:" 
            value={userData.addressStreet} 
            onChange={handleStringChange('addressStreet')} 
            type="text" 
            error={errors.addressStreet}
        />
        <TextInputWithLabel 
            id={`address-building-number`} 
            label="Building number:" 
            value={userData.addressBuildingNumber} 
            onChange={handleStringChange('addressBuildingNumber')} 
            type="text" 
            error={errors.addressBuildingNumber}
        />
        <TextInputWithLabel 
            id={`address-apartment-number`} 
            label="Apartment number:" 
            value={userData.addressApartmentNumber} 
            onChange={handleStringChange('addressApartmentNumber')} 
            type="text" 
            error={errors.addressApartmentNumber}
        />
        <TextInputWithLabel 
            id={`address-city`} 
            label="City:" 
            value={userData.addressCity} 
            onChange={handleStringChange('addressCity')} 
            type="text" 
            error={errors.addressCity}
        />
        <TextInputWithLabel 
            id={`address-zip-code`} 
            label="Zip code:" 
            value={userData.addressZipCode} 
            onChange={handleStringChange('addressZipCode')} 
            type="text" 
            error={errors.addressZipCode}
        />
        <TextInputWithLabel 
            id={`address-country`} 
            label="Country:" 
            value={userData.addressCountry} 
            onChange={handleStringChange('addressCountry')} 
            type="text" 
            error={errors.addressCountry}
        />
    </div>
  );

  export function UserDetailsModal(props: UserDetailsModalProps) {
    const close = () => {
      props.setShow(false);
    };

    const submit = async (e: any) => {
      e.preventDefault();
      close();
    };
    
    const userAddress = props.userData.address.split('|');

    const [userInfo, setUserInfo] = React.useState<UserInfo>({
      name: props.userData.fullName,
      email: props.userData.email,
      addressStreet: userAddress[0],
      addressBuildingNumber: userAddress[1],
      addressApartmentNumber: userAddress[2],
      addressCity: userAddress[3],
      addressZipCode: userAddress[4],
      addressCountry: userAddress[5]
    });

    const handleStringChange = <T extends keyof UserInfo>(field: T) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;
      setUserInfo(prevState => ({
          ...prevState,
          [field]: newValue
      }));
    };

    const [formIsValid, setFormIsValid] = React.useState(true); 
    const [userInfoErrors, setUserInfoErrors] = React.useState<UserInfoErrors>({});

    const [error, setError] = React.useState("");
    const [success, setSuccess] = React.useState("");
  
    const [userInfoLoading, setUserInfoLoading] = React.useState(false);
    const [requestId, setRequestId] = React.useState("");
  
    const navigate = useNavigate();

    const validateForm = () => {
        const errors: UserInfoErrors = {};

        // validation of basic info section

        if (!userInfo.name) {
            errors.name = "Your name is required!";
        }

        if (!userInfo.email) {
            errors.email = "Your email is required!";
        }

        // validation of address section

        if (!userInfo.addressStreet) {
            errors.addressStreet = "Street in your address is required!";
        }

        if (!userInfo.addressBuildingNumber) {
            errors.addressBuildingNumber = "Building number in your address is required!";
        }

        if (!userInfo.addressBuildingNumber) {
          errors.addressApartmentNumber = "Building number in your address is required!";
        }

        if (!userInfo.addressCity) {
            errors.addressCity = "City in your address is required!";
        }

        if (!userInfo.addressZipCode) {
            errors.addressZipCode = "Zip code in your address is required!";
        }

        if (!userInfo.addressCountry) {
            errors.addressCountry = "Country in your address is required!";
        }

        setUserInfoErrors(errors);
        return Object.keys(errors).length === 0; 
    };

    const onSubmit = (e: any) => {
      e.preventDefault();

      const isFormValid = validateForm();
      setFormIsValid(isFormValid);

      if (!isFormValid) {
          return;
      }

      if (userInfoLoading) return;
      setError("");
      setSuccess("");
      setUserInfoLoading(true);

      createOrder(
        props.userId,
        props.offer.parcelId,
        userInfo.name,
        userInfo.email,
        userInfo.addressStreet,
        userInfo.addressBuildingNumber,
        userInfo.addressApartmentNumber,
        userInfo.addressCity,
        userInfo.addressZipCode,
        userInfo.addressCountry,
        props.offer.company)
        .then((response) => {
          setRequestId(response);
          setSuccess("Offer request submitted successfully!");
          setUserInfo(
          {
            name: "",
            email: "",
            addressStreet: "",
            addressBuildingNumber: "",
            addressApartmentNumber: "",
            addressCity: "",
            addressZipCode: "",
            addressCountry: ""
        });
      })

      .catch((err) => {
        setError(err?.response?.data?.reason || "Something went wrong!");
      })
      .finally(() => {
        setUserInfoLoading(false);
      });
    };

    const redirectToHome = () => {
      close();
      navigate("/", {state:{parcelId: null}});
    };

    const redirectToOrders = () => {
      close();
      navigate("/orders", {state:{parcelId: null}});
    };

    return (
      <React.Fragment>
        <Modal show={props.show} size="4xl" popup={true} onClose={close}>
          <Modal.Header />
          <Modal.Body style={{ overflowY: 'scroll' }}>
            <form onSubmit={onSubmit}>
              <div className="space-y-6 px-6 pb-4 sm:pb-6 lg:px-8 xl:pb-8">
                <div className="space-y-6 gap-6" style={{ maxHeight: '70vh', paddingBottom: '20px' }}>
                  {!success ? (
                    <div>
                      <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                        Check price details and complete data if necessary:
                      </h1>

                      <div className="space-y-6 gap-6">
                        <div style={{ marginBottom: '40px' }}></div>
                      </div>

                      <div className="flex flex-col gap-6">

                        <SectionTitle title="Price break down" />

                        {props.offer.priceBreakDown != null && props.offer.priceBreakDown?.length > 0 ? (
                          props.offer.priceBreakDown?.map((element: any) => element != null ? (
                            <PriceBreakDownElement
                              key={element.description}
                              element={element}
                            />
                          ) : null)
                        ) : null}

                        <SectionTitle title="Your basic info" />

                        <BasicInfoSection 
                            userData={userInfo}
                            handleStringChange={handleStringChange}
                            errors={userInfoErrors}
                        />
                        
                        <SectionTitle title="Your address" />

                        <AddressSection 
                            userData={userInfo}
                            handleStringChange={handleStringChange}
                            errors={userInfoErrors}
                        />

                        {!formIsValid && <p className="text-red-500">Please fill in all required fields.</p>}

                        <Alerts error={error} success={success} />
                        
                        {error ? null : <SubmitButton userInfoLoading={userInfoLoading} />}
                      </div>

                      <div className="space-y-6 gap-6">
                        <div style={{ marginBottom: '40px' }}></div>
                      </div>
                    </div>
                  ) : null}
                  {success ? (
                    <div>
                      <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                        Offer request submitted successfully!
                      </h1>

                      <div className="space-y-6 gap-6">
                        <div style={{ marginBottom: '40px' }}></div>
                      </div>

                      <Alert color="success" icon={HiCheckCircle} className="mb-3">
                        <span>
                          <span className="font-bold">Success!</span> {success}
                        </span>
                      </Alert>
                      
                      <div className="space-y-6 gap-6">
                        <div style={{ marginBottom: '40px' }}></div>
                      </div>

                      <LabelsWithBorder
                        idA="elementName"
                        valueA="Id of your offer request:"
                        idB="elementValue"
                        valueB={`${requestId}`}
                      />
                      
                      <div className="space-y-6 gap-6">
                        <div style={{ marginBottom: '30px' }}></div>
                      </div>

                      <p className="text-orange-600">Remember to confirm or cancel your offer request after potential approval.</p>

                      { (props.userId === null) ?
                        <div className="space-y-6 gap-6">
                          <p className="text-blue-400">You can do it by going to home page and typing the id presented above in "Order id" field.</p>
                        </div>
                      : null }
                      
                      <div className="space-y-6 gap-6">
                          <div style={{ marginBottom: '30px' }}></div>
                      </div>

                      { (props.userId === null) ?
                        <div className="space-y-6 gap-6">
                          <div className="flex justify-end">
                            <Button onClick={() => redirectToHome()}>Go to home page</Button>
                          </div>
                        </div>
                      :
                        <div className="space-y-6 gap-6">
                          <div className="flex justify-end">
                            <Button onClick={() => redirectToOrders()}>Go to your orders</Button>
                          </div>
                        </div>
                      }
                    </div>
                  ) : null}
                </div>
              </div>
            </form>
          </Modal.Body>
        </Modal>
      </React.Fragment>
    );
  }
  