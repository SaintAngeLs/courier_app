"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.getParcelsForCourier = exports.getParcelsForCar = exports.createParcel = exports.getCars = exports.getCar = exports.updateCar = exports.createCar = exports.getParcels = exports.deleteCar = exports.getCarPersonal = exports.getDelivery = exports.getDeliveries = exports.deleteCourier = exports.updateCourier = exports.createCourier = exports.getCourier = exports.getCouriers = exports.getParcel = exports.deleteParcel = exports.updateParcel = exports.getInquiries = exports.createInquiry = exports.getUsers = exports.getProfile = exports.logout = exports.register = exports.login = void 0;
var axios_1 = require("axios");
var storage_1 = require("./storage");
var API_BASE_URL = 'http://localhost:6001';
var api = axios_1["default"].create({
    baseURL: "http://localhost:5292",
    withCredentials: true
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
var getAuthHeader = function () {
    var userInfo = storage_1.getUserInfo();
    if (!userInfo || !userInfo.accessToken) {
        console.warn('No user token found. Redirecting to login.');
        window.location.href = '/login';
        return null;
    }
    console.log({ Authorization: "Bearer " + userInfo.accessToken });
    return { Authorization: "Bearer " + userInfo.accessToken };
};
var defaultPageLimit = 10;
exports.login = function (email, password) { return __awaiter(void 0, void 0, void 0, function () {
    var response, _a, accessToken, refreshToken, role, expires, error_1;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                return [4 /*yield*/, api.post('/identity/sign-in', { email: email, password: password })];
            case 1:
                response = _c.sent();
                _a = response.data, accessToken = _a.accessToken, refreshToken = _a.refreshToken, role = _a.role, expires = _a.expires;
                storage_1.saveUserInfo({ token: accessToken, refreshToken: refreshToken, role: role, expires: expires });
                return [2 /*return*/, response.data];
            case 2:
                error_1 = _c.sent();
                if (axios_1["default"].isAxiosError(error_1)) {
                    console.error('Error during login:', ((_b = error_1.response) === null || _b === void 0 ? void 0 : _b.data) || error_1.message);
                }
                else {
                    console.error('Error during login:', error_1);
                }
                throw error_1;
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.register = function (username, password, email) { return __awaiter(void 0, void 0, void 0, function () {
    var response, error_2;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                return [4 /*yield*/, api.post("/identity/sign-up", {
                        username: username,
                        password: password,
                        email: email
                    })];
            case 1:
                response = _b.sent();
                return [2 /*return*/, response.data];
            case 2:
                error_2 = _b.sent();
                if (axios_1["default"].isAxiosError(error_2)) {
                    console.error('Error during registration (Axios error):', ((_a = error_2.response) === null || _a === void 0 ? void 0 : _a.data) || error_2.message);
                }
                else {
                    console.error('Error during registration:', error_2);
                }
                throw error_2;
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.logout = function () { return __awaiter(void 0, void 0, void 0, function () {
    var headers, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, 3, 4]);
                headers = getAuthHeader();
                return [4 /*yield*/, api.get('/identity/logout', { headers: headers })];
            case 1:
                _a.sent();
                return [3 /*break*/, 4];
            case 2:
                error_3 = _a.sent();
                console.error('Logout failed:', error_3);
                return [3 /*break*/, 4];
            case 3:
                storage_1.saveUserInfo(null);
                window.location.href = '/login';
                return [7 /*endfinally*/];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getProfile = function () { return __awaiter(void 0, void 0, void 0, function () {
    var headers, userId, response, error_4;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                headers = getAuthHeader();
                userId = storage_1.getUserIdFromStorage();
                if (!userId) {
                    throw new Error('User ID not found');
                }
                return [4 /*yield*/, api.get("identity/users/" + userId, { headers: headers })];
            case 1:
                response = _c.sent();
                console.log("identity/users/${userId}: ", response.data);
                return [2 /*return*/, response.data];
            case 2:
                error_4 = _c.sent();
                if (axios_1["default"].isAxiosError(error_4)) {
                    console.error('Error fetching profile:', ((_a = error_4.response) === null || _a === void 0 ? void 0 : _a.data) || error_4.message);
                    if (((_b = error_4.response) === null || _b === void 0 ? void 0 : _b.status) === 401) {
                        storage_1.saveUserInfo(null);
                        window.location.href = '/login';
                    }
                }
                else {
                    console.error('Error fetching profile:', error_4);
                }
                throw error_4;
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getUsers = function (page, perPage) {
    if (page === void 0) { page = 1; }
    if (perPage === void 0) { perPage = defaultPageLimit; }
    return __awaiter(void 0, void 0, void 0, function () {
        var response, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, api.get("/identity/users?page=" + page + "&size=" + perPage, { headers: getAuthHeader() })];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, response.data];
                case 2:
                    error_5 = _a.sent();
                    console.error('Error during getting users:', error_5);
                    throw error_5;
                case 3: return [2 /*return*/];
            }
        });
    });
};
exports.createInquiry = function (description, width, height, depth, weight, sourceStreet, sourceBuildingNumber, sourceApartmentNumber, sourceCity, sourceZipCode, sourceCountry, destinationStreet, destinationBuildingNumber, destinationApartmentNumber, destinationCity, destinationZipCode, destinationCountry, priority, atWeekend, pickupDate, deliveryDate, isCompany, vipPackage) { return __awaiter(void 0, void 0, void 0, function () {
    var userInfo, userResponse, customerId, payload, inquiryResponse_1, offerResponse, offerError_1, inquiryError_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 7, , 8]);
                userInfo = storage_1.getUserInfo();
                // if (!userInfo || !userInfo.accessToken) {
                //   console.warn('No user token found. Redirecting to login.');
                //   window.location.href = '/login';
                //   return;
                // }
                // Log the token for debugging
                console.log("Using access token:", userInfo.accessToken);
                return [4 /*yield*/, exports.getProfile()];
            case 1:
                userResponse = _b.sent();
                customerId = userResponse ? userResponse.id : null;
                payload = {
                    // ParcelId: "00000000-0000-0000-0000-000000000000", // Remove if backend generates ID
                    CustomerId: customerId,
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
                return [4 /*yield*/, api.post("/parcels", payload, {
                        headers: { Authorization: "Bearer " + userInfo.accessToken }
                    })];
            case 2:
                inquiryResponse_1 = _b.sent();
                _b.label = 3;
            case 3:
                _b.trys.push([3, 5, , 6]);
                return [4 /*yield*/, new Promise(function (resolve, reject) {
                        setTimeout(function () {
                            api.get("deliveries-service/deliveries", { params: { parcelId: inquiryResponse_1.data.parcelId } })
                                .then(resolve)["catch"](reject);
                        }, 30000); // Wait for 30 seconds
                    })];
            case 4:
                offerResponse = _b.sent();
                return [2 /*return*/, { inquiry: inquiryResponse_1, offers: offerResponse }];
            case 5:
                offerError_1 = _b.sent();
                console.error('Error fetching courier offers:', offerError_1);
                // Return the inquiry response even if fetching offers fails
                return [2 /*return*/, { inquiry: inquiryResponse_1.data, offers: null }];
            case 6: return [3 /*break*/, 8];
            case 7:
                inquiryError_1 = _b.sent();
                if (axios_1["default"].isAxiosError(inquiryError_1)) {
                    console.error('Error during inquiry creation (Axios error):', ((_a = inquiryError_1.response) === null || _a === void 0 ? void 0 : _a.data) || inquiryError_1.message);
                }
                else {
                    console.error('Error during inquiry creation:', inquiryError_1);
                }
                throw inquiryError_1;
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.getInquiries = function () { return __awaiter(void 0, void 0, void 0, function () {
    var response, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, api.get("/parcels", { headers: getAuthHeader() })];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response.data];
            case 2:
                error_6 = _a.sent();
                console.error('Error during getting inquiries:', error_6);
                throw error_6;
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.updateParcel = function (parcelId, data) { return __awaiter(void 0, void 0, void 0, function () {
    var response, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, api.put("/parcels/" + parcelId, data, { headers: getAuthHeader() })];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response.data];
            case 2:
                error_7 = _a.sent();
                console.error('Error updating parcel:', error_7);
                throw error_7;
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.deleteParcel = function (parcelId) { return __awaiter(void 0, void 0, void 0, function () {
    var response, error_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, api["delete"]("/parcels/" + parcelId, { headers: getAuthHeader() })];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response.data];
            case 2:
                error_8 = _a.sent();
                console.error('Error deleting parcel:', error_8);
                throw error_8;
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getParcel = function (parcelId) { return __awaiter(void 0, void 0, void 0, function () {
    var response, error_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, api.get("/parcels/" + parcelId, { headers: getAuthHeader() })];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response.data];
            case 2:
                error_9 = _a.sent();
                console.error('Error fetching parcel:', error_9);
                throw error_9;
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getCouriers = function (page, perPage) {
    if (page === void 0) { page = 1; }
    if (perPage === void 0) { perPage = defaultPageLimit; }
    return __awaiter(void 0, void 0, void 0, function () {
        var response, error_10;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, api.get("/couriers?page=" + page + "&size=" + perPage, { headers: getAuthHeader() })];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, response.data];
                case 2:
                    error_10 = _a.sent();
                    console.error('Error during getting couriers:', error_10);
                    throw error_10;
                case 3: return [2 /*return*/];
            }
        });
    });
};
exports.getCourier = function (courierId) { return __awaiter(void 0, void 0, void 0, function () {
    var response, error_11;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, api.get("/couriers/" + courierId, { headers: getAuthHeader() })];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response.data];
            case 2:
                error_11 = _a.sent();
                console.error('Error fetching courier:', error_11);
                throw error_11;
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.createCourier = function (courierData) { return __awaiter(void 0, void 0, void 0, function () {
    var response, error_12;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, api.post("/couriers", courierData, { headers: getAuthHeader() })];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response.data];
            case 2:
                error_12 = _a.sent();
                console.error('Error creating courier:', error_12);
                throw error_12;
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.updateCourier = function (courierId, courierData) { return __awaiter(void 0, void 0, void 0, function () {
    var response, error_13;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, api.put("/couriers/" + courierId, courierData, { headers: getAuthHeader() })];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response.data];
            case 2:
                error_13 = _a.sent();
                console.error('Error updating courier:', error_13);
                throw error_13;
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.deleteCourier = function (courierId) { return __awaiter(void 0, void 0, void 0, function () {
    var response, error_14;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, api["delete"]("/couriers/" + courierId, { headers: getAuthHeader() })];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response.data];
            case 2:
                error_14 = _a.sent();
                console.error('Error deleting courier:', error_14);
                throw error_14;
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getDeliveries = function (deliveryId) { return __awaiter(void 0, void 0, void 0, function () {
    var response, error_15;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, api.get("/deliveries/" + deliveryId, { headers: getAuthHeader() })];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response.data];
            case 2:
                error_15 = _a.sent();
                console.error('Error fetching delivery:', error_15);
                throw error_15;
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getDelivery = function (deliveryId) { return __awaiter(void 0, void 0, void 0, function () {
    var response, error_16;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, api.get("/deliveries/" + deliveryId, { headers: getAuthHeader() })];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response.data];
            case 2:
                error_16 = _a.sent();
                console.error('Error fetching delivery:', error_16);
                throw error_16;
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getCarPersonal = {};
exports.deleteCar = {};
exports.getParcels = {};
exports.createCar = {};
exports.updateCar = {};
exports.getCar = {};
exports.getCars = {};
exports.createParcel = {};
exports.getParcelsForCar = {};
exports.getParcelsForCourier = {};
