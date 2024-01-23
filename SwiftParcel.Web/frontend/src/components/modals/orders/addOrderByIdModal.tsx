import {
    Alert,
    Button,
    Label,
    Modal,
    Spinner,
    TextInput,
  } from "flowbite-react";
  import React from "react";
  import { BsBoxSeam } from "react-icons/bs";
  import { HiInformationCircle } from "react-icons/hi";
  import { addCustomerToOrder } from "../../../utils/api";
  import { getUserIdFromStorage, getUserInfo } from "../../../utils/storage";
  
  interface AddOrderByIdModalProps {
    show: boolean;
    setShow: (show: boolean) => void;
  }

  export function AddOrderByIdModal(props: AddOrderByIdModalProps) {
    const close = () => {
      setOrderId("");
      setIsLoading(false);
      setError("");
      props.setShow(false);

      if (success !== "") {
        setSuccess("");
        window.location.reload();
      }
    };

    const [orderId, setOrderId] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState("");
    const [success, setSuccess] = React.useState("");

    const submit = async (e: any) => {
      e.preventDefault();
      setError("");
      setIsLoading(true);

      addCustomerToOrder(orderId, getUserIdFromStorage())
        .then((res) => {
            setSuccess("Order added successfully!");
        })
        .catch((err) => {
            setError(err?.response?.data?.reason || "Something went wrong!");
        })
        .finally(() => {
            setIsLoading(false);
        });
    };
    
    return (
      <React.Fragment>
        <Modal show={props.show} size="4xl" popup={true} onClose={close}>
          <Modal.Header />
          <Modal.Body style={{ overflowY: 'scroll' }}>
            <form onSubmit={submit}>
              <div className="space-y-6 px-6 pb-4 sm:pb-6 lg:px-8 xl:pb-8">
                <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                  Add order by id:
                </h1>
                <div style={{ marginBottom: '40px' }}></div>
                {error ? (
                  <Alert color="failure" icon={HiInformationCircle}>
                    <span>{error}</span>
                  </Alert>
                ) : null}
                {success ? (
                  <Alert color="success" icon={HiInformationCircle}>
                    <span>
                      <span className="font-bold">Success!</span> {success}
                    </span>
                  </Alert>
                ) : null}
                <div className="space-y-6 gap-6" style={{ maxHeight: '70vh', paddingBottom: '20px' }}>
                  <div>
                    <TextInput
                        placeholder="Order id"
                        className="w-full"
                        type="text"
                        sizing="lg"
                        required={true}
                        icon={BsBoxSeam}
                        value={orderId}
                        onChange={(e) => setOrderId(e.target.value)}
                    />

                    <div style={{ marginBottom: '20px' }}></div>

                    <div className="space-y-6 w-full" style={{ display: 'flex', justifyContent: 'center' }}>
                    {isLoading ? (
                        <Button className="w-full">
                        <div className="mr-3">
                            <Spinner size="sm" light={true} />
                        </div>
                        Loading ...
                        </Button>
                    ) : (
                        <Button className="w-full" type="submit" onClick={submit}>Add order</Button>
                    )}
                    </div>

                  </div>
                </div>
              </div>
            </form>
          </Modal.Body>
        </Modal>
      </React.Fragment>
    );
  }
  