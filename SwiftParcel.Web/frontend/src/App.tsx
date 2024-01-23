import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { RolesAuthRoute } from "./utils/others";
import { Suspense } from "react";
import { Loader } from "./components/loader";
import Parcels from "./pages/parcels/parcels";
import ManageParcels from "./pages/parcels/manage";
import Register from "./pages/register";
import ManageParcelsCourier from "./pages/parcels/courier";
import Home from "./pages/home";
import ManageCouriers from "./pages/couriers/manage";
import ManageCars from "./pages/cars/manage";
import ManageParcelsCar from "./pages/cars/parcels";
import CreateInquiry from "./pages/inquiries/createInquiry";
import Inquiries from "./pages/inquiries/inquiries";
import Offers from "./pages/offers/offersUser";
import OfferRequests from "./pages/offers/offerRequests";
import PendingOffers from "./pages/offers/pendingOffers";
import Orders from "./pages/orders/orders";
import YourDeliveries from "./pages/deliveries/yourDeliveries";
import PendingDeliveries from "./pages/deliveries/pendingDeliveries";

export function App() {

  
  return (
    <Router>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/create-inquiry"
            element={
              <RolesAuthRoute roles={['user', null]}>
                <CreateInquiry/>
              </RolesAuthRoute>
            }
          />
          <Route
            path="/inquiries"
            element={
              <RolesAuthRoute roles={['officeworker', 'user']}>
                <Inquiries />
              </RolesAuthRoute>
            }
          />
          <Route
            path="/offers"
            element={
              <RolesAuthRoute roles={['user', null]}>
                <Offers/>
              </RolesAuthRoute>
            }
          />
          <Route
            path="/offer-requests"
            element={
              <RolesAuthRoute roles={['officeworker']}>
                <OfferRequests />
              </RolesAuthRoute>
            }
          />
          <Route
            path="/manage-pending-offers"
            element={
              <RolesAuthRoute roles={['officeworker']}>
                <PendingOffers />
              </RolesAuthRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <RolesAuthRoute roles={['user']}>
                <Orders/>
              </RolesAuthRoute>
            }
          />
          <Route
            path="/register"
            element={
              <RolesAuthRoute roles={['user', null]}>
                <Register />
              </RolesAuthRoute>
            }
          />
          <Route
            path="/your-deliveries"
            element={
              <RolesAuthRoute roles={["courier"]}>
                <YourDeliveries />
              </RolesAuthRoute>
            }
          />
                    <Route
            path="/pending-deliveries"
            element={
              <RolesAuthRoute roles={["courier"]}>
                <PendingDeliveries />
              </RolesAuthRoute>
            }
          />
          <Route
            path="/parcels"
            element={
              <RolesAuthRoute roles={['officeworker', 'courier']}>
                <Parcels />
              </RolesAuthRoute>
            }
          />
          <Route
            path="/couriers/manage"
            element={
              <RolesAuthRoute roles={["courier"]}>
                <ManageCouriers />
              </RolesAuthRoute>
            }
          />
          <Route
            path="/parcels/manage"
            element={
              <RolesAuthRoute roles={["courier"]}>
                <ManageParcels />
              </RolesAuthRoute>
            }
          />
          <Route
            path="/couriers/:courierId/parcels/manage"
            element={
              <RolesAuthRoute roles={["courier"]}>
                <ManageParcelsCourier />
              </RolesAuthRoute>
            }
          />
          <Route
            path="/cars/:carId/parcels/manage"
            element={
              <RolesAuthRoute roles={["courier"]}>
                <ManageParcelsCar />
              </RolesAuthRoute>
            }
          />
          <Route
            path="/cars/manage"
            element={
              <RolesAuthRoute roles={["courier"]}>
                <ManageCars />
              </RolesAuthRoute>
            }
          />
        </Routes>
      </Suspense>
    </Router>
  );
}
