import {
  Alert,
  Button,
  Checkbox,
  Label,
  Spinner,
  TextInput,
} from "flowbite-react";
import React from "react";
import { HiInformationCircle, HiCheckCircle } from "react-icons/hi";
import { Footer } from "../components/footer";
import { Header } from "../components/header";
import { Loader } from "../components/loader";
import { register, completeCustomerRegistration } from "../utils/api";

export default function Register() {
  const [loading, setLoading] = React.useState(true);

  const [email, setEmail] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  const [customerId, setCustomerId] = React.useState(null);
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");

  const [street, setStreet] = React.useState("");
  const [buildingNumber, setBuildingNumber] = React.useState("");
  const [apartmentNumber, setApartmentNumber] = React.useState("");
  const [city, setCity] = React.useState("");
  const [zipCode, setZipCode] = React.useState("");
  const [country, setCountry] = React.useState("");

  const termsCheckboxRef = React.useRef<HTMLInputElement>(null);

  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");
  const [registerLoading, setRegisterLoading] = React.useState(false);
  const [registerFinished, setRegisterFinished] = React.useState(false);

  const [completionError, setCompletionError] = React.useState("");
  const [completionSuccess, setCompletionSuccess] = React.useState("");
  const [completionLoading, setCompletionLoading] = React.useState(false);

  const onRegister = async (e: any) => {
    e.preventDefault();
    if (registerLoading) return;
    setError("");
    setSuccess("");
    setRegisterLoading(true);

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      setRegisterLoading(false);
      return;
    }

    if (!termsCheckboxRef.current?.checked) {
      setError("Please accept the terms and conditions!");
      setRegisterLoading(false);
      return;
    }

    register(email, password, "user")
      .then((res) => {
        setCustomerId(res);
        setSuccess(
          "Registration successful! Please complete data referring to you below."
        );
      })
      .catch((err) => {
        setError(err?.response?.data?.reason || "Something went wrong during registration!");
      })
      .finally(() => {
        setRegisterLoading(false);
        setRegisterFinished(true);
      });
  };

  const onComplete = async (e: any) => {
    e.preventDefault();
    if (completionLoading) return;
    setCompletionError("");
    setCompletionSuccess("");
    setCompletionLoading(true);

    completeCustomerRegistration(
      customerId,
      firstName,
      lastName,
      `${street}|${buildingNumber}|${apartmentNumber}|${city}|${zipCode}|${country}`,
      "Empty")
      .then((res) => {
        setCompletionSuccess(
          res?.data?.message || "Completion of registration successful! Please login."
        );

        setEmail("");
        setUsername("");
        setPassword("");
        setConfirmPassword("");

        setCustomerId(null);
        setFirstName("");
        setLastName("");
        
        setStreet("");
        setBuildingNumber("");
        setApartmentNumber("");
        setCity("");
        setZipCode("");
        setCountry("");

        termsCheckboxRef.current!.checked = false;
      })
      .catch((err) => {
        setCompletionError(err?.response?.data?.message || "Something went wrong during completion of registration!");
      })
      .finally(() => {
        setCompletionLoading(false);
      });
  };

  return (
    <>
      {loading ? <Loader /> : null}
      <div className="container mx-auto px-4">
        <Header loading={loading} setLoading={setLoading} />
        <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
          Create an account
        </h1>
        <p className="mb-5">
          Please register below. If you already have an account, please login
          using the button in the top right corner.
        </p>
        <form className="flex flex-col gap-4 mb-5" onSubmit={onRegister}>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="email" value="Your email" />
            </div>
            <TextInput
              id="email"
              type="email"
              placeholder="email@example.com"
              required={true}
              shadow={true}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <div className="mb-2 block">
              <Label htmlFor="username" value="Your username" />
            </div>
            <TextInput
              id="username"
              type="text"
              required={true}
              shadow={true}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          
          <div>
            <div className="mb-2 block">
              <Label htmlFor="password" value="Your password" />
            </div>
            <TextInput
              id="password"
              type="password"
              required={true}
              shadow={true}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <div className="mb-2 block">
              <Label htmlFor="repeat-password" value="Repeat password" />
            </div>
            <TextInput
              id="repeat-password"
              type="password"
              required={true}
              shadow={true}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox id="agree" ref={termsCheckboxRef} />
            <Label htmlFor="agree">
              I agree with the{" "}
              <span className="text-blue-600 hover:underline dark:text-blue-500">
                terms and conditions
              </span>
            </Label>
          </div>
          
          {registerLoading ? (
            <Button type="submit" disabled={true}>
              <div className="mr-3">
                <Spinner size="sm" light={true} />
              </div>
              Registering ...
            </Button>
          ) : (
            <Button type="submit">Register new account</Button>
          )}
        </form>

        {error ? (
            <Alert color="failure" icon={HiInformationCircle} className="mb-3">
              <span>
                <span className="font-bold">Error!</span> {error}
              </span>
            </Alert>
          ) : null}
          {success ? (
            <Alert color="success" icon={HiCheckCircle} className="mb-3">
              <span>
                <span className="font-bold">Success!</span> {success}
              </span>
            </Alert>
          ) : null}

        {(registerFinished && error === "") ? (
          <form className="flex flex-col gap-4 mb-5" onSubmit={onComplete}>
            <div className="flex flex-col gap-4 mb-5">
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="firstname" value="Your firstname" />
                </div>
                <TextInput
                  id="firstname"
                  type="text"
                  required={true}
                  shadow={true}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>

              <div>
                <div className="mb-2 block">
                  <Label htmlFor="lastname" value="Your lastname" />
                </div>
                <TextInput
                  id="lastname"
                  type="text"
                  required={true}
                  shadow={true}
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>

            <div className="col-span-2 grid grid-cols-2 gap-4">
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="street" value="Your street" />
                </div>
                <TextInput
                  id="street"
                  type="text"
                  required={true}
                  shadow={true}
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                />
              </div>

              <div>
                <div className="mb-2 block">
                  <Label htmlFor="building-number" value="Your building number" />
                </div>
                <TextInput
                  id="building-number"
                  type="text"
                  required={true}
                  shadow={true}
                  value={buildingNumber}
                  onChange={(e) => setBuildingNumber(e.target.value)}
                />
              </div>

              <div>
                <div className="mb-2 block">
                  <Label htmlFor="apartment-number" value="Your apartment number" />
                </div>
                <TextInput
                  id="apartment-number"
                  type="text"
                  required={false}
                  shadow={true}
                  value={apartmentNumber}
                  onChange={(e) => setApartmentNumber(e.target.value)}
                />
              </div>

              <div>
                <div className="mb-2 block">
                  <Label htmlFor="city" value="Your city" />
                </div>
                <TextInput
                  id="city"
                  type="text"
                  required={true}
                  shadow={true}
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>

              <div>
                <div className="mb-2 block">
                  <Label htmlFor="zip-code" value="Your zip code" />
                </div>
                <TextInput
                  id="city"
                  type="text"
                  required={true}
                  shadow={true}
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                />
              </div>

              <div>
                <div className="mb-2 block">
                  <Label htmlFor="country" value="Your country" />
                </div>
                <TextInput
                  id="city"
                  type="text"
                  required={true}
                  shadow={true}
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
              </div>
            </div>
          </div>

          {(completionLoading) ? (
            <Button type="submit" disabled={true}>
              <div className="mr-3">
                <Spinner size="sm" light={true} />
              </div>
              Completing registration ...
            </Button>
          ) : (
            <Button type="submit">Complete registration of new account</Button>
          )}
        </form>
        ) : null}

        {completionError ? (
          <Alert color="failure" icon={HiInformationCircle} className="mb-3">
            <span>
              <span className="font-bold">Error!</span> {completionError}
            </span>
          </Alert>
        ) : null}
        {completionSuccess ? (
          <Alert color="success" icon={HiCheckCircle} className="mb-3">
            <span>
              <span className="font-bold">Success!</span> {completionSuccess}
            </span>
          </Alert>
        ) : null}
        <Footer />
      </div>
    </>
  );
}
