import {
  Alert,
  Button,
  Label,
  Modal,
  Spinner,
  TextInput,
} from "flowbite-react";
import React from "react";
import { Link } from "react-router-dom";
import { login } from "../../utils/api";
import { saveUserInfo } from "../../utils/storage";
import { HiInformationCircle } from "react-icons/hi";

interface LoginModalProps {
  show: boolean;
  setShow: (show: boolean) => void;
}

export function LoginModal(props: LoginModalProps) {
  const close = () => {
    setUsername("");
    setPassword("");
    setError("");
    setIsLoading(false);
    props.setShow(false);
  };

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const submit = async (e: any) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    login(username, password)
      .then(async (res) => {
        if (res.status === 201) {
          saveUserInfo(res.data);
          close();
        } else {
          throw new Error("Something went wrong");
        }
      })
      .catch((err) => {
        setError(err?.response?.data?.message || "Something went wrong");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <React.Fragment>
      <Modal show={props.show} size="md" popup={true} onClose={close}>
        <Modal.Header />
        <Modal.Body>
          <form onSubmit={submit}>
            <div className="space-y-6 px-6 pb-4 sm:pb-6 lg:px-8 xl:pb-8">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                Sign in to our platform
              </h3>
              {error ? (
                <Alert color="failure" icon={HiInformationCircle}>
                  <span>{error}</span>
                </Alert>
              ) : null}
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="username" value="Your username" />
                </div>
                <TextInput
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required={true}
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="password" value="Your password" />
                </div>
                <TextInput
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required={true}
                />
              </div>
              <div className="w-full">
                {isLoading ? (
                  <Button>
                    <div className="mr-3">
                      <Spinner size="sm" light={true} />
                    </div>
                    Loading ...
                  </Button>
                ) : (
                  <Button type="submit">Log in to your account</Button>
                )}
              </div>
              <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
                Not registered?{" "}
                <Link
                  to="/register"
                  className="text-blue-700 hover:underline dark:text-blue-500"
                >
                  Create account
                </Link>
              </div>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
}
