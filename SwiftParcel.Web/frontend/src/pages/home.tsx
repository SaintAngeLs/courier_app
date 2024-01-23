import { Badge, Button, Select, Spinner, TextInput } from "flowbite-react";
import React from "react";
import { BsBoxSeam } from "react-icons/bs";
import { HiExclamation } from "react-icons/hi";
import { Footer } from "../components/footer";
import { Header } from "../components/header";
import { Loader } from "../components/loader";
import { getOrder } from "../utils/api";
import { Link } from "react-router-dom";
import { OrderDetailsModal } from "../components/modals/orders/orderDetailsModal";

export default function Home() {
  const [loading, setLoading] = React.useState(true);

  const [orderId, setOrderId] = React.useState("");
  const [error, setError] = React.useState(false);
  const [errorText, setErrorText] = React.useState("");

  const [order, setOrder] = React.useState<any>(null);
  const [loadingOrder, setLoadingOrder] = React.useState(false);
  const [showOrderDetailsModal, setShowOrderDetailsModal] = React.useState(false);

  const handleAnonymousInquirySubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(false);
    setLoadingOrder(true);
    getOrder(orderId)
        .then((res) => {
          if (res?.data) {
            setOrder(res?.data);
          } else {
            setOrder(null);
            setError(true);
            setErrorText("Order not found");
          }
        })
        .catch((err) => {
          setOrder(null);
          setError(true);
          setErrorText("Order not found");
        })
        .finally(() => {
          setLoadingOrder(false);
          setShowOrderDetailsModal(true);
        });
  };

  return (
    <>
      {loading ? <Loader /> : null}
      <div className="container mx-auto px-4">
        <Header loading={loading} setLoading={setLoading} />
        <div className="flex flex-col items-center justify-center my-20">
          <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
              Post Your Parcel
          </h1>
          <p className="mb-4 text-gray-600 dark:text-gray-400">
              Give your requirements and get many options to choose the best one.
          </p>
          <Link
            to="/create-inquiry" 
            className="mt-4 w-full md:w-1/2">
            <Button
              gradientDuoTone="cyanToBlue"
              size="xl"
              className="mt-4 w-full"
              type="submit">
              Create an inquiry
            </Button>
          </Link>
        </div>

        <form onSubmit={onSubmit}>
          <div className="flex flex-col items-center justify-center my-20">
            <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
              Check Your Order
            </h1>
            <p className="mb-4 text-gray-600 dark:text-gray-400">
              Give id of your order to see its details.
            </p>

            <div
              className={`mb-4 flex flex-row gap-2 items-center transition-all duration-1000 ease-in-out ${
                error ? "opacity-100" : "opacity-0"
              }`}
            >
              <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-500 dark:bg-orange-700 dark:text-orange-200">
                <HiExclamation className="h-5 w-5" />
              </div>
              <div className="ml-3 text-sm font-normal text-gray-500">
                {errorText}
              </div>
            </div>

            <TextInput
              placeholder="Order id"
              className="w-full md:w-1/2"
              type="text"
              sizing="lg"
              required={true}
              icon={BsBoxSeam}
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
            />
            <Button
              gradientDuoTone="cyanToBlue"
              size="xl"
              className="mt-4 w-full md:w-1/2"
              type="submit"
            >
              {loadingOrder ? (
                <>
                  <div className="mr-3">
                    <Spinner size="sm" light={true} />
                  </div>
                  Loading ...
                </>
              ) : (
                "Check Order"
              )}
            </Button>
          </div>
        </form>

        { order ?
          <OrderDetailsModal
            show={showOrderDetailsModal}
            setShow={setShowOrderDetailsModal}
            order={order}
          />
        : null }

        <Footer />
      </div>
    </>
  );
}