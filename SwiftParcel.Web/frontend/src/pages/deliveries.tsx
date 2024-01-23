import React from "react";
import CurrentCar from "../components/currentCar";
import { Footer } from "../components/footer";
import { Header } from "../components/header";
import { Loader } from "../components/loader";
// import Stats from "../components/stats";
import {getParcel, updateParcel } from "../utils/api";
import GoogleMapReact from "google-map-react";

import { IoLocationSharp } from "react-icons/io5";
import { FiPhoneCall } from "react-icons/fi";
import { AiOutlineWarning } from "react-icons/ai";
import { Alert, Badge, Button, Spinner } from "flowbite-react";
import { Link } from "react-router-dom";
import { ConfirmModal } from "../components/modals/confirmModal";

export default function Deliveries() {
  const [loadingHeader, setLoadingHeader] = React.useState(true);
  const [loadingCar, setLoadingCar] = React.useState(true);
  const [loadingParcel, setLoadingParcel] = React.useState(true);
  const [parcel, setParcel] = React.useState<any>(null);
  const [location, setLocation] = React.useState<any>(null);

  const [showFinishDeliveryModal, setShowFinishDeliveryModal] =
    React.useState(false);

  const [loadingChangeStatus, setLoadingChangeStatus] = React.useState(false);

  React.useEffect(() => {
    const parcelId = localStorage.getItem("parcelId") || null;
    if (parcelId) {
      getParcel(parcelId)
        .then((res) => {
          setParcel(res?.data);
        })
        .finally(() => {
          setLoadingParcel(false);
        });
    } else {
      setLoadingParcel(false);
    }
  }, []);

  // React.useEffect(() => {
  //   if (parcel) {
  //     getCoordinates(parcel?.receiverAddress).then((res) => {
  //       if (res?.status === 200 && res?.data?.length > 0) {
  //         const { lat, lon, display_name } = res?.data[0];
  //         setLocation({
  //           center: { lat: parseFloat(lat), lng: parseFloat(lon) },
  //           name: display_name,
  //           sName: parcel?.receiverAddress,
  //         });
  //       }
  //     });
  //   }
  // }, [parcel]);

  const LocationPin = ({ text }: any) => (
    <div style={{ display: "flex", alignItems: "center", width: "180px" }}>
      <IoLocationSharp className="w-10 h-10" />
      <p className="pin-text">{text}</p>
    </div>
  );

  const changeStatus = (status: string) => {
    setLoadingChangeStatus(true);
    const parcelId = localStorage.getItem("parcelId") || null;
    if (parcelId) {
      updateParcel(parcelId, { status })
        .then((res) => {
          if (res?.status === 200) {
            setParcel(res?.data);
          }
        })
        .finally(() => {
          setLoadingChangeStatus(false);
        });
    }
  };

  return (
    <>
      {loadingHeader || loadingCar || loadingParcel ? <Loader /> : null}
      <div className="container mx-auto px-4">
        <Header loading={loadingHeader} setLoading={setLoadingHeader} />
        <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
          Deliveries
        </h1>
        <div className="flex-wrap gap-2 grid grid-cols-1 sm:grid-cols-2">
          <CurrentCar loading={loadingCar} setLoading={setLoadingCar} />
          {/* <Stats parcel={parcel} /> */}
        </div>
        <h2 className="my-3 text-2xl font-bold text-gray-900 dark:text-white">
          Parcel to deliver
        </h2>
        {parcel ? (
          <div className="flex-wrap gap-2 grid grid-cols-1 sm:grid-cols-2">
            <div className="flex flex-col flex-wrap gap-2">
              <span className="flex flex-wrap gap-2">
                <b>#{parcel?.parcelNumber}</b>
                <Badge
                  color={
                    parcel?.status === "Pending"
                      ? "warning"
                      : parcel?.status === "In progress"
                      ? "pink"
                      : "success"
                  }
                  size="sm"
                  className="text-center"
                >
                  {parcel?.status}
                </Badge>
              </span>
              <span className="flex flex-col">
                <b>Sender:</b> {parcel?.senderName}
                <span className="flex flex-wrap gap-2 items-center">
                  <a
                    href={"http://maps.google.com/?q=" + parcel?.senderAddress}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <IoLocationSharp />
                  </a>
                  {parcel?.senderAddress}
                </span>
                <span className="flex flex-wrap gap-2 items-center">
                  <a href={"tel:" + parcel?.senderPhone}>
                    <FiPhoneCall />
                  </a>{" "}
                  {parcel?.senderPhone}
                </span>
              </span>
              <span className="flex flex-col">
                <b>Receiver:</b> {parcel?.receiverName}
                <span className="flex flex-wrap gap-2 items-center">
                  <a
                    href={
                      "http://maps.google.com/?q=" + parcel?.receiverAddress
                    }
                    target="_blank"
                    rel="noreferrer"
                  >
                    <IoLocationSharp />
                  </a>
                  {parcel?.receiverAddress}
                </span>
                <span className="flex flex-wrap gap-2 items-center">
                  <a href={"tel:" + parcel?.receiverPhone}>
                    <FiPhoneCall />
                  </a>{" "}
                  {parcel?.receiverPhone}
                </span>
              </span>
              <span className="flex flex-col">
                <b>Weight:</b> {parcel?.weight} kg
              </span>
              <span className="flex flex-col">
                <b>Payout:</b> {parcel?.price} €
              </span>
              <span className="flex flex-col">
                {parcel?.status === "Pending" ? (
                  loadingChangeStatus ? (
                    <Button>
                      <div className="mr-3">
                        <Spinner size="sm" light={true} />
                      </div>
                      Loading ...
                    </Button>
                  ) : (
                    <Button onClick={() => changeStatus("In progress")}>
                      Start delivery
                    </Button>
                  )
                ) : parcel?.status === "In progress" ? (
                  loadingChangeStatus ? (
                    <Button color="success">
                      <div className="mr-3">
                        <Spinner size="sm" light={true} />
                      </div>
                      Loading ...
                    </Button>
                  ) : (
                    <>
                      <Button
                        color="success"
                        onClick={() => setShowFinishDeliveryModal(true)}
                      >
                        Finish delivery
                      </Button>

                      <ConfirmModal
                        show={showFinishDeliveryModal}
                        setShow={setShowFinishDeliveryModal}
                        onConfirm={() => changeStatus("Delivered")}
                        message={
                          "Are you sure you have finished this delivery?"
                        }
                        confirmText={"Yes, I have"}
                        cancelText={"No, cancel"}
                        confirmColor="success"
                      />
                    </>
                  )
                ) : (
                  <Alert color="warning" rounded={true} icon={AiOutlineWarning}>
                    <span>
                      {"Select the next parcel to deliver from "}
                      <Link to="/parcels" className="text-blue-700">
                        Parcel list
                      </Link>
                    </span>
                  </Alert>
                )}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              {location != null ? (
                <div style={{ width: "100%", height: "400px" }}>
                  {/* <GoogleMapReact
                    bootstrapURLKeys={{ key: "" }}
                    defaultCenter={location.center}
                    defaultZoom={16}
                  >
                    <LocationPin
                      lat={location.center.lat}
                      lng={location.center.lng}
                      text={location.sName}
                    />
                  </GoogleMapReact> */}
                </div>
              ) : (
                <span className="text-center">
                  Address not found on site map, please click the button below
                  to open the map.
                </span>
              )}
              <span className="flex flex-wrap gap-2 justify-center">
                <Button
                  href={"http://maps.google.com/?q=" + parcel?.receiverAddress}
                >
                  <IoLocationSharp className="mr-2 h-5 w-5" />
                  Open location on maps
                </Button>
                <Button href={"tel:" + parcel?.receiverPhone}>
                  <FiPhoneCall className="mr-2 h-5 w-5" />
                  Call parcel receiver
                </Button>
              </span>
            </div>
          </div>
        ) : (
          <Alert color="warning" rounded={true} icon={AiOutlineWarning}>
            <span>
              {"No parcel to deliver, please select a parcel to deliver from "}
              <Link to="/parcels" className="text-blue-700">
                Parcel list
              </Link>
            </span>
          </Alert>
        )}
        <Footer />
      </div>
    </>
  );
}
