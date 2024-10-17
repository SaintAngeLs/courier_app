import { Button, Dropdown, Navbar } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";

import { FiLogIn } from "react-icons/fi";
import { FaShippingFast } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { getUserInfo, saveUserInfo } from "../utils/storage";
import { LoginModal } from "./modals/loginModal";
import React, { useState } from "react";
import { getProfile, logout } from "../utils/api";
import AppNavLink from "./appNavLink";
import { getUserIdFromStorage } from "../utils/storage";

export function Header(props: {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  showLoginModal?: boolean;
  setShowLoginModal?: (loading: boolean) => void;
}) {
  const [modal, setModal] = React.useState(1);
  const [showLoginModal, setShowLoginModal] = React.useState(false);

  const navigate = useNavigate();

  const [userInfo, setUserInfo] = React.useState<any>(null);
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState('');
  
  const [userToken, setUserToken] = React.useState<any>(false);

  React.useEffect(() => {
    if (getUserIdFromStorage() === null) {
      setShowLoginModal(props.showLoginModal);
    }
  }, [modal]);

  React.useEffect(() => {
    setUserToken(getUserInfo());
  }, [showLoginModal]);

  React.useEffect(() => {
    console.log('User token updated:', userToken);
  }, [userToken]);

  React.useMemo(() => {
    if (userToken) {
      getProfile()
        .then((res) => {
          console.log("res", res);
          setUserEmail(res.email);
          setUserRole(res.role);

          if (res?.status === 200) {

            const newUserInfo = { ...getUserInfo(), courier: res.courier };
            saveUserInfo(newUserInfo);
          
          } else {
            throw new Error();
          }
        })
        .catch(() => {
          // saveUserInfo(null);
          // setUserToken(null);
          // setIsCourier(false);
        })
        .finally(() => {
          props.setLoading(false);
        });
    } else if (userToken === null) {
      props.setLoading(false);
      
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userToken]);

  const logoutUser = async () => {
    logout();
    setUserToken(null);
    localStorage.removeItem("parcelId");
    navigate("/");
  };


  const renderNavLinks = () => {
    switch (userRole) {
      case 'courier':
        return (
          <>
            <AppNavLink to="/your-deliveries" text="Your Deliveries" />
            <AppNavLink to="/pending-deliveries" text="Pending Deliveries" />
          </>
        );
      case 'officeworker':
        return (
          <>
            <AppNavLink to="/inquiries" text="Bank Inquiries" />
            <AppNavLink to="/offer-requests" text="Bank Offer Requests" />
            <AppNavLink to="/manage-pending-offers" text="Manage Pending Offers" />
          </>
        );
      case 'user':
        return (
          <>
            <AppNavLink to="/" text="Check Order" />
            <AppNavLink to="/create-inquiry" text="Create Inquiry" />
            <AppNavLink to="/inquiries" text="Your Inquiries" />
            <AppNavLink to="/orders" text="Your Orders" />
          </>
        );
      default:
        return (
          <>
            <AppNavLink to="/" text="Check Order" />
            <AppNavLink to="/create-inquiry" text="Create Inquiry" />
          </>
        );
    }
  };

  return (
    <>
      <Navbar fluid={false} rounded={true} className="mb-5">
        <Link to="/" className="flex items-center">
          <FaShippingFast className="mr-2 h-10 w-10 text-blue-700" />
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
            Swift Parcel
          </span>
        </Link>
        <div className="flex md:order-2">
          {userToken ? (
            <Dropdown
              arrowIcon={false}
              inline={true}
              label={<CgProfile className="text-blue-700 w-8 h-8 mr-2" />}
            >
              <Dropdown.Header>
                <span className="block text-sm">
                  {userToken?.user?.username}
                </span>
                <span className="block truncate text-sm font-medium">
                  {userEmail || 'Email not available'}
                </span>
              </Dropdown.Header>
              <Dropdown.Item onClick={logoutUser}>Sign out</Dropdown.Item>
            </Dropdown>
          ) : (
            <Button className="mr-2" onClick={() => setShowLoginModal(true)}>
              <FiLogIn className="sm:mr-2 h-4 w-4" />
              <span className="hidden sm:flex">Sign in</span>
            </Button>
          )}
          {userToken?.user?.role === "admin" || userToken?.courier !== null ? (
            <Navbar.Toggle />
          ) : null}
        </div>
        <Navbar.Collapse>
          {renderNavLinks()}
        </Navbar.Collapse>
      </Navbar>
      <LoginModal show={showLoginModal} setShow={setShowLoginModal} />
    </>
  );
}
