import axios from "axios";
import { getUserIdFromStorage, getUserInfo, saveUserInfo } from "./storage";


const api = axios.create({
  baseURL: "http://api-gateway:5000",
  withCredentials: true,
});

// api.interceptors.response.use(
//   response => response,
//   error => {
//     if (axios.isAxiosError(error) && error.response?.status === 401) {
//       //// saveUserInfo(null);
//       window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   }
// );

const getAuthHeader = () => {
  const userInfo = getUserInfo();
  if (!userInfo || !userInfo.accessToken) {
    console.warn('No user token found. Not redirecting to login.');
    //window.location.href = '/login';
    return null;
  }
  console.log({Authorization: `Bearer ${userInfo.accessToken}`})
  return { Authorization: `Bearer ${userInfo.accessToken}` };
};

const defaultPageLimit = 10;

export const login = async (email: string, password: string) => {
  try {
    const response = await api.post('/identity/sign-in', { email, password });
    const { accessToken, refreshToken, role, expires } = response.data;

    saveUserInfo({ token: accessToken, refreshToken, role, expires }); 
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error during login:', error.response?.data || error.message);
    } else {
      console.error('Error during login:', error);
    }
    throw error;
  }
};

export const register = async (
  email: string,
  password: string,
  role: string
) => {
  try {

    const payload = {
      Email: email,
      Password: password, 
      Role: role
    };

    console.log("Request payload (register):", payload);

    console.log("JSON being sent (register):", JSON.parse(JSON.stringify(payload)));

    const response = await api.post(`/identity/sign-up`, JSON.parse(JSON.stringify(payload)), {
      headers: {
        'Content-Type': 'application/json'
      }
    })

    console.log("response:", response);

    return response.data;

  } catch (registerError) {
    if (axios.isAxiosError(registerError) && registerError.response) {
      console.error('Error status:', registerError.response.status);
      console.error('Error data:', registerError.response.data);
      console.error('Error during registration:', registerError.message);
    } else {
      console.error('Error during registration:', registerError);
    }
    throw registerError;
  }
};

export const completeCustomerRegistration = async (
  customerId: string,
  firstName: string,
  lastName: string,
  address: string,
  sourceAddress: string
) => {
  try {

    const payload = {
      CustomerId: customerId,
      FirstName: firstName,
      LastName: lastName,
      Address: address,
      SourceAddress: sourceAddress
    };

    console.log("Request payload (customer completion):", payload);

    console.log("JSON being sent (customer completion):", JSON.parse(JSON.stringify(payload)));

    const response = await api.post(`/customers`, JSON.parse(JSON.stringify(payload)), {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return response.data;

  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error('Error status:', error.response.status);
      console.error('Error data:', error.response.data);
      console.error('Error during registration:', error.message);
    } else {
      console.error('Error during registration:', error);
    }
    throw error;
  }
};

export const logout = async () => {
  try {
    const headers = getAuthHeader();
    await api.get('/identity/logout', { headers });
  } catch (error) {
    console.error('Logout failed:', error);
  } finally {
    saveUserInfo(null);
    window.location.href = '/login';
  }
};

export const getProfile = async () => {
  try {
    const headers = getAuthHeader();
    const userId = getUserIdFromStorage(); 
    if (!userId) {
      throw new Error('User ID not found');
    }

    const response = await api.get(`identity/users/${userId}`, { headers });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error fetching profile:', error.response?.data || error.message);
      if (error.response?.status === 401) {
        saveUserInfo(null);
        window.location.href = '/login';
      }
    } else {
      console.error('Error fetching profile:', error);
    }
    throw error;
  }
};


export const getUsers = async (page = 1, perPage = defaultPageLimit) => {
  try {
    const response = await api.get(`/identity/users?page=${page}&size=${perPage}`, { headers: getAuthHeader() });
    return response.data;
  } catch (error) {
    console.error('Error during getting users:', error);
    throw error;
  }
};

// This requewst is going OK
// the next reques is used for the testing purpose:
// ──(kaliuser㉿kali)-[~/…/wisdom_source.com/courier_app]
// └─$ curl -X POST 'http://localhost:5007/parcels' \
// -H 'Content-Type: application/json' \
// -d '{
//     "ParcelId": "00000000-0000-0000-0000-000000000000",
//     "CustomerId": "00000000-0000-0000-0000-000000000000",
//     "Description": "TestYYYYYYYY",
//     "Width": 0.05,
//     "Height": 0.05,
//     "Depth": 0.05,
//     "Weight": 0.5,
//     "SourceStreet": "Plac politechniki",
//     "SourceBuildingNumber": "1",
//     "SourceApartmentNumber": "",
//     "SourceCity": "Warszawa",
//     "SourceZipCode": "00-420",
//     "SourceCountry": "Polska",
//     "DestinationStreet": "Koszykowa",
//     "DestinationBuildingNumber": "21",
//     "DestinationApartmentNumber": "37",
//     "DestinationCity": "Warszawa",
//     "DestinationZipCode": "00-420",
//     "DestinationCountry": "Polska",
//     "Priority": "Low",
//     "AtWeekend": true,
//     "PickupDate": "2023-12-22T00:00:00.000Z",
//     "DeliveryDate": "2023-12-29T00:00:00.000Z",
//     "IsCompany": false,
//     "VipPackage": false
// }'


export const createInquiry = async (
  customerId: string,
  description: string,
  width: number,
  height: number,
  depth: number,
  weight: number,
  sourceStreet: string,
  sourceBuildingNumber: string,
  sourceApartmentNumber: string,
  sourceCity: string,
  sourceZipCode: string,
  sourceCountry: string,
  destinationStreet: string,
  destinationBuildingNumber: string,
  destinationApartmentNumber: string,
  destinationCity: string,
  destinationZipCode: string,
  destinationCountry: string,
  priority: string,
  atWeekend: boolean,
  pickupDate: string,
  deliveryDate: string,
  isCompany: boolean,
  vipPackage: boolean
) => {
  try {
    
    // Log the token for debugging
    //console.log("Using access token:", userInfo.accessToken);

    //const userData = await getProfile();
    //const customerId = userData.id.toString() || "00000000-0000-0000-0000-000000000000"; 

    const payload = {
      ...(customerId !== null && { CustomerId: customerId }),
      Description: description,
      Width: width,
      Height: height,
      Depth: depth,
      Weight: weight,
      SourceStreet: sourceStreet,
      SourceBuildingNumber: sourceBuildingNumber,
      SourceApartmentNumber: sourceApartmentNumber,
      SourceCity: sourceCity,
      SourceZipCode: sourceZipCode,
      SourceCountry: sourceCountry,
      DestinationStreet: destinationStreet,
      DestinationBuildingNumber: destinationBuildingNumber,
      DestinationApartmentNumber: destinationApartmentNumber,
      DestinationCity: destinationCity,
      DestinationZipCode: destinationZipCode,
      DestinationCountry: destinationCountry,
      Priority: priority,
      AtWeekend: atWeekend,
      PickupDate: pickupDate,
      DeliveryDate: deliveryDate,
      IsCompany: isCompany,
      VipPackage: vipPackage
    };

    console.log("Request payload:", payload);

    console.log("JSON being sent:", JSON.parse(JSON.stringify(payload)));

    const response = await api.post(`/parcels`, JSON.parse(JSON.stringify(payload)), {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    // .then((inquiryResponse) => {
    //   console.log("inquiryResponse:", inquiryResponse);
    //   return inquiryResponse;
    // });

    return response.data;
    
    // return response.data;

    // try {
    //   const offerResponse = await new Promise((resolve, reject) => {
    //     setTimeout(() => {
    //       api.get(`deliveries-service/deliveries`, { params: { parcelId: inquiryResponse.data.parcelId } })
    //         .then(resolve)
    //         .catch(reject);
    //     }, 30000); // Wait for 30 seconds
    //   });

    //   return { inquiry: inquiryResponse, offers: offerResponse };
    // } catch (offerError) {
    //   console.error('Error fetching courier offers:', offerError);
    //   // Return the inquiry response even if fetching offers fails
    //   return { inquiry: inquiryResponse.data, offers: null };
    // }

  } catch (inquiryError) {
    if (axios.isAxiosError(inquiryError) && inquiryError.response) {
      console.error('Error status:', inquiryError.response.status);
      console.error('Error data:', inquiryError.response.data);
      console.error('Error during inquiry creation:', inquiryError.message);
    } else {
      console.error('Error during inquiry creation:', inquiryError);
    }
    throw inquiryError;
  }
};

export const createOrder = async (
  customerId: string,
  parcelId: string,
  name: string,
  email: string,
  street: string,
  buildingNumber: string,
  apartmentNumber: string,
  city: string,
  zipCode: string,
  country: string,
  company: string
) => {
  try {

    const payload = {
      ...(customerId !== null && { CustomerId: customerId }),
      ParcelId: parcelId,
      Name: name,
      Email: email,
      Address: {
        street,
        buildingNumber,
        apartmentNumber,
        city,
        zipCode,
        country
      },
      Company: company
    };

    console.log("Request payload:", payload);

    console.log("JSON being sent:", JSON.parse(JSON.stringify(payload)));

    const response = await api.post(`/orders`, JSON.parse(JSON.stringify(payload)), {
      headers: {
        'Content-Type': 'application/json'
      }
    })

    return response.data;

  } catch (orderError) {
    if (axios.isAxiosError(orderError) && orderError.response) {
      console.error('Error status:', orderError.response.status);
      console.error('Error data:', orderError.response.data);
      console.error('Error during order creation:', orderError.message);
    } else {
      console.error('Error during order creation:', orderError);
    }
    throw orderError;
  }
};

export const getInquiriesUser = async (customerId: string) => {
  try {
    const response = await api.get(`/parcels/customerId=${customerId}`, { headers: getAuthHeader() });
    return response;
  } catch (error) {
    console.error('Error during getting inquiries:', error);
    throw error;
  }
};

export const getInquiriesOfficeWorker = async () => {
  try {
    const response = await api.get(`/parcels/office-worker`, { headers: getAuthHeader() });
    return response;
  } catch (error) {
    console.error('Error during getting inquiries:', error);
    throw error;
  }
};

export const getOrder = async (orderId: string) => {
  try {
    const response = await api.get(`/orders/${orderId}`);
    return response;
  } catch (error) {
    console.error('Error during getting orders:', error);
    throw error;
  }
};

export const getOrdersUser = async (customerId: string) => {
  try {
    const response = await api.get(`/orders/customerId=${customerId}`, { headers: getAuthHeader() });
    return response;
  } catch (error) {
    console.error('Error during getting orders:', error);
    throw error;
  }
};

export const getOffers = async (parcelId: string) => {
  try {
    const response = await api.get(`/parcels/${parcelId}/offers`, { headers: getAuthHeader() });
    return response;
  } catch (error) {
    console.error('Error during getting offers:', error);
    throw error;
  }
};

export const getOfferRequests = async () => {
  try {
    const response = await api.get(`/orders/office-worker`, { headers: getAuthHeader() });
    return response;
  } catch (error) {
    console.error('Error during getting offer requests:', error);
    throw error;
  }
};

export const getPendingOffers = async () => {
  try {
    const response = await api.get(`/orders/office-worker/pending`, { headers: getAuthHeader() });
    return response;
  } catch (error) {
    console.error('Error during getting pending offers:', error);
    throw error;
  }
};

export const approvePendingOffer = async (orderId : string) => {
  try {
    const payload = {
      OrderId: orderId
    };

    console.log("Request payload:", payload);

    console.log("JSON being sent:", JSON.parse(JSON.stringify(payload)));

    const response = await api.put(`/orders/${orderId}/office-worker/approve`, JSON.parse(JSON.stringify(payload)), { headers: getAuthHeader() });
    return response;
  } catch (error) {
    console.error('Error during approving pending offer:', error);
    throw error;
  }
};

export const cancelPendingOffer = async (orderId : string, reason: string) => {
  try {
    const payload = {
      OrderId: orderId,
      Reason: reason
    };

    console.log("Request payload:", payload);

    console.log("JSON being sent:", JSON.parse(JSON.stringify(payload)));
    
    const response = await api.put(`/orders/${orderId}/office-worker/cancel`, payload, { headers: getAuthHeader() });
    return response;
  } catch (error) {
    console.error('Error during cancelling pending offer:', error);
    throw error;
  }
};

export const confirmOrder = async (
  orderId: string,
  company: string
) => {
  try {

    const payload = {
      OrderId: orderId,
      Company: company
    };

    console.log("Request payload:", payload);

    console.log("JSON being sent:", JSON.parse(JSON.stringify(payload)));

    const response = await api.post(`/orders/${orderId}/confirm`, JSON.parse(JSON.stringify(payload)), {
      headers: {
        'Content-Type': 'application/json'
      }
    })

    return response.data;

  } catch (orderError) {
    if (axios.isAxiosError(orderError) && orderError.response) {
      console.error('Error status:', orderError.response.status);
      console.error('Error data:', orderError.response.data);
      console.error('Error during order confirmation:', orderError.message);
    } else {
      console.error('Error during order confirmation:', orderError);
    }
    throw orderError;
  }
};

export const cancelOrder = async (
  orderId: string,
  company: string
) => {
  try {

    const payload = {
      OrderId: orderId,
      Company: company
    };

    console.log("Request payload:", payload);

    console.log("JSON being sent:", JSON.parse(JSON.stringify(payload)));

    const response = await api.delete(`/orders/${orderId}/cancel`, JSON.parse(JSON.stringify(payload)))

    return response.data;

  } catch (orderError) {
    if (axios.isAxiosError(orderError) && orderError.response) {
      console.error('Error status:', orderError.response.status);
      console.error('Error data:', orderError.response.data);
      console.error('Error during order cancellation:', orderError.message);
    } else {
      console.error('Error during order cancellation:', orderError);
    }
    throw orderError;
  }
};

export const addCustomerToOrder = async (
  orderId: string,
  customerId: string
) => {
  try {

    const userInfo = getUserInfo();
    if (!userInfo || !userInfo.accessToken) {
      console.warn('No user token found. Redirecting to login.');
      window.location.href = '/login';
      return;
    }

    const payload = {
      OrderId: orderId,
      CustomerId: customerId
    };

    console.log("Request payload:", payload);

    console.log("JSON being sent:", JSON.parse(JSON.stringify(payload)));

    const response = await api.post(`/orders/${orderId}/customer`, JSON.parse(JSON.stringify(payload)), {
      headers: {
        'Authorization': `${userInfo.accessToken}`,
        'Content-Type': 'application/json'
      }
    })

    return response.data;

  } catch (orderError) {
    if (axios.isAxiosError(orderError) && orderError.response) {
      console.error('Error status:', orderError.response.status);
      console.error('Error data:', orderError.response.data);
      console.error('Error during adding customer to order:', orderError.message);
    } else {
      console.error('Error during adding customer to order:', orderError);
    }
    throw orderError;
  }
};

export const getYourDeliveries = async (courierId: string) => {
  try {
    const response = await api.get(`/deliveries/courierId=${courierId}`, { headers: getAuthHeader() });
    return response;
  } catch (error) {
    console.error('Error during getting your deliveries:', error);
    throw error;
  }
};

export const getPendingDeliveries = async () => {
  try {
    const response = await api.get(`/deliveries/pending`, { headers: getAuthHeader() });
    return response;
  } catch (error) {
    console.error('Error during getting pending deliveries:', error);
    throw error;
  }
};

export const assignCourierToDelivery = async (
  deliveryId: string,
  courierId: string
) => {
  try {

    const userInfo = getUserInfo();
    if (!userInfo || !userInfo.accessToken) {
      console.warn('No user token found. Redirecting to login.');
      window.location.href = '/login';
      return;
    }
    
    const payload = {
      DeliveryId: deliveryId,
      CourierId: courierId
    };

    console.log("Request payload:", payload);

    console.log("JSON being sent:", JSON.parse(JSON.stringify(payload)));

    const response = await api.post(`/deliveries/${deliveryId}/courier`, JSON.parse(JSON.stringify(payload)), {
      headers: {
        'Authorization': `${userInfo.accessToken}`,
        'Content-Type': 'application/json'
      }
    })

    return response.data;

  } catch (orderError) {
    if (axios.isAxiosError(orderError) && orderError.response) {
      console.error('Error status:', orderError.response.status);
      console.error('Error data:', orderError.response.data);
      console.error('Error during assigning delivery to courier:', orderError.message);
    } else {
      console.error('Error during assigning delivery to courier:', orderError);
    }
    throw orderError;
  }
}

export const pickupDelivery = async (
  deliveryId: string
) => {
  try {

    const userInfo = getUserInfo();
    if (!userInfo || !userInfo.accessToken) {
      console.warn('No user token found. Redirecting to login.');
      window.location.href = '/login';
      return;
    }

    const payload = {
      DeliveryId: deliveryId
    };

    console.log("Request payload:", payload);

    console.log("JSON being sent:", JSON.parse(JSON.stringify(payload)));

    const response = await api.post(`/deliveries/${deliveryId}/pick-up`, JSON.parse(JSON.stringify(payload)), {
      headers: {
        'Authorization': `${userInfo.accessToken}`,
        'Content-Type': 'application/json'
      }
    })

    return response.data;

  } catch (orderError) {
    if (axios.isAxiosError(orderError) && orderError.response) {
      console.error('Error status:', orderError.response.status);
      console.error('Error data:', orderError.response.data);
      console.error('Error during picking up delivery:', orderError.message);
    } else {
      console.error('Error during picking up delivery:', orderError);
    }
    throw orderError;
  }
};

export const completeDelivery = async (
  deliveryId: string,
  deliveryAttemptDate: any
) => {
  try {

    const userInfo = getUserInfo();
    if (!userInfo || !userInfo.accessToken) {
      console.warn('No user token found. Redirecting to login.');
      window.location.href = '/login';
      return;
    }

    const payload = {
      DeliveryId: deliveryId,
      DeliveryAttemptDate: deliveryAttemptDate
    };

    console.log("Request payload:", payload);

    console.log("JSON being sent:", JSON.parse(JSON.stringify(payload)));

    const response = await api.post(`/deliveries/${deliveryId}/complete`, JSON.parse(JSON.stringify(payload)), {
      headers: {
        'Authorization': `${userInfo.accessToken}`,
        'Content-Type': 'application/json'
      }
    })

    return response.data;

  } catch (orderError) {
    if (axios.isAxiosError(orderError) && orderError.response) {
      console.error('Error status:', orderError.response.status);
      console.error('Error data:', orderError.response.data);
      console.error('Error during completing delivery:', orderError.message);
    } else {
      console.error('Error during completing delivery:', orderError);
    }
    throw orderError;
  }
};

export const failDelivery = async (
  deliveryId: string,
  deliveryAttemptDate: any,
  reason: string
) => {
  try {

    const userInfo = getUserInfo();
    if (!userInfo || !userInfo.accessToken) {
      console.warn('No user token found. Redirecting to login.');
      window.location.href = '/login';
      return;
    }

    const payload = {
      DeliveryId: deliveryId,
      DeliveryAttemptDate: deliveryAttemptDate,
      Reason: reason
    };

    console.log("Request payload:", payload);

    console.log("JSON being sent:", JSON.parse(JSON.stringify(payload)));

    const response = await api.post(`/deliveries/${deliveryId}/fail`, JSON.parse(JSON.stringify(payload)), {
      headers: {
        'Authorization': `${userInfo.accessToken}`,
        'Content-Type': 'application/json'
      }
    })

    return response.data;

  } catch (orderError) {
    if (axios.isAxiosError(orderError) && orderError.response) {
      console.error('Error status:', orderError.response.status);
      console.error('Error data:', orderError.response.data);
      console.error('Error during failing delivery:', orderError.message);
    } else {
      console.error('Error during failing delivery:', orderError);
    }
    throw orderError;
  }
};

export const getCustomerData = async (customerId: string) => {
  try {
    const response = await api.get(`/customers/${customerId}`, { headers: getAuthHeader() });
    return response;
  } catch (error) {
    console.error('Error during getting customer data:', error);
    throw error;
  }
};

export const updateParcel = async (parcelId: string, data: any) => {
  try {
    const response = await api.put(`/parcels/${parcelId}`, data, { headers: getAuthHeader() });
    return response.data;
  } catch (error) {
    console.error('Error updating parcel:', error);
    throw error;
  }
};

export const deleteParcel = async (parcelId: string) => {
  try {
    const response = await api.delete(`/parcels/${parcelId}`, { headers: getAuthHeader() });
    return response.data;
  } catch (error) {
    console.error('Error deleting parcel:', error);
    throw error;
  }
};

export const getParcel = async (parcelId: string) => {
  try {
    const response = await api.get(`/parcels/${parcelId}`, { headers: getAuthHeader() });
    return response.data;
  } catch (error) {
    console.error('Error fetching parcel:', error);
    throw error;
  }
};

export const getCouriers = async (page = 1, perPage = defaultPageLimit) => {
  try {
    const response = await api.get(`/couriers?page=${page}&size=${perPage}`, { headers: getAuthHeader() });
    return response.data;
  } catch (error) {
    console.error('Error during getting couriers:', error);
    throw error;
  }
};

export const getCourier = async (courierId) => {
  try {
    const response = await api.get(`/couriers/${courierId}`, { headers: getAuthHeader() });
    return response.data;
  } catch (error) {
    console.error('Error fetching courier:', error);
    throw error;
  }
};

export const createCourier = async (courierData) => {
  try {
    const response = await api.post(`/couriers`, courierData, { headers: getAuthHeader() });
    return response.data;
  } catch (error) {
    console.error('Error creating courier:', error);
    throw error;
  }
};

export const updateCourier = async (courierId, courierData) => {
  try {
    const response = await api.put(`/couriers/${courierId}`, courierData, { headers: getAuthHeader() });
    return response.data;
  } catch (error) {
    console.error('Error updating courier:', error);
    throw error;
  }
};

export const deleteCourier = async (courierId) => {
  try {
    const response = await api.delete(`/couriers/${courierId}`, { headers: getAuthHeader() });
    return response.data;
  } catch (error) {
    console.error('Error deleting courier:', error);
    throw error;
  }
};

export const getDeliveries = async (deliveryId: string) => {
  try {
    const response = await api.get(`/deliveries/${deliveryId}`, { headers: getAuthHeader() });
    return response.data;
  } catch (error) {
    console.error('Error fetching delivery:', error);
    throw error;
  }
};

export const getDelivery = async (deliveryId) => {
  try {
    const response = await api.get(`/deliveries/${deliveryId}`, { headers: getAuthHeader() });
    return response.data;
  } catch (error) {
    console.error('Error fetching delivery:', error);
    throw error;
  }
};

export const getCarPersonal = {};
export const deleteCar = {};
export const getParcels = {};
export const createCar = {};
export const updateCar = {};
export const getCar = {};
export const getCars = {};
export const createParcel = {};
export const getParcelsForCar = {};
export const getParcelsForCourier = {};