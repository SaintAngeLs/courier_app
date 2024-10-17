"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var flowbite_react_1 = require("flowbite-react");
var react_1 = require("react");
var hi_1 = require("react-icons/hi");
var footer_1 = require("../components/footer");
var header_1 = require("../components/header");
var loader_1 = require("../components/loader");
var api_1 = require("../utils/api");
var TextInputWithLabel = function (_a) {
    var id = _a.id, label = _a.label, value = _a.value, onChange = _a.onChange;
    return (react_1["default"].createElement("div", { className: "mb-4 flex-col flex" },
        react_1["default"].createElement(flowbite_react_1.Label, { htmlFor: id, className: "mb-2 block text-sm font-medium text-gray-700 " }, label),
        react_1["default"].createElement(flowbite_react_1.TextInput, { id: id, type: "text", value: value, onChange: function (e) { return onChange(e.target.value); }, className: "border-gray-300 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm rounded-md" })));
};
var DateInputWithLabel = function (_a) {
    var id = _a.id, label = _a.label, value = _a.value, onChange = _a.onChange;
    return (react_1["default"].createElement("div", { className: "mb-4" },
        react_1["default"].createElement(flowbite_react_1.Label, { htmlFor: id }, label),
        react_1["default"].createElement(flowbite_react_1.TextInput, { id: id, type: "date", value: value, onChange: function (e) { return onChange(e.target.value); } })));
};
var SectionTitle = function (_a) {
    var title = _a.title;
    return (react_1["default"].createElement("div", { className: "mb-4 border-b border-gray-300 pb-1" },
        react_1["default"].createElement("h2", { className: "text-xl font-semibold text-gray-800" }, title)));
};
var Alerts = function (_a) {
    var error = _a.error, success = _a.success;
    return (react_1["default"].createElement(react_1["default"].Fragment, null,
        error && react_1["default"].createElement(flowbite_react_1.Alert, { color: "failure" }, error),
        success && react_1["default"].createElement(flowbite_react_1.Alert, { color: "success" }, success)));
};
var SubmitButton = function (_a) {
    var inquiryLoading = _a.inquiryLoading;
    return (react_1["default"].createElement("div", { className: "flex justify-end" },
        react_1["default"].createElement(flowbite_react_1.Button, { type: "submit", disabled: inquiryLoading }, inquiryLoading ? react_1["default"].createElement(flowbite_react_1.Spinner, null) : "Create new inquiry")));
};
var ShortDescriptionSection = function (_a) {
    var description = _a.description, setDescription = _a.setDescription;
    return (react_1["default"].createElement("div", { className: "my-5" },
        react_1["default"].createElement(flowbite_react_1.Label, { htmlFor: "description" }, "Short Description:"),
        react_1["default"].createElement(flowbite_react_1.TextInput, { id: "description", value: description, onChange: function (e) { return setDescription(e.target.value); } })));
};
var PackageDetailsSection = function (_a) {
    var packageWidth = _a.packageWidth, setPackageWidth = _a.setPackageWidth, packageHeight = _a.packageHeight, setPackageHeight = _a.setPackageHeight, packageDepth = _a.packageDepth, setPackageDepth = _a.setPackageDepth, packageWeight = _a.packageWeight, setPackageWeight = _a.setPackageWeight;
    return (react_1["default"].createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4" },
        react_1["default"].createElement(TextInputWithLabel, { id: "package-width", label: "Width", value: packageWidth, onChange: setPackageWidth }),
        react_1["default"].createElement(TextInputWithLabel, { id: "package-height", label: "Height", value: packageHeight, onChange: setPackageHeight }),
        react_1["default"].createElement(TextInputWithLabel, { id: "package-depth", label: "Depth", value: packageDepth, onChange: setPackageDepth }),
        react_1["default"].createElement(TextInputWithLabel, { id: "package-weight", label: "Weight", value: packageWeight, onChange: setPackageWeight })));
};
var DeliveryDetailsSection = function (_a) {
    var pickupDate = _a.pickupDate, setPickupDate = _a.setPickupDate, deliveryDate = _a.deliveryDate, setDeliveryDate = _a.setDeliveryDate, priority = _a.priority, setPriority = _a.setPriority, atWeekend = _a.atWeekend, setAtWeekend = _a.setAtWeekend, isCompany = _a.isCompany, setIsCompany = _a.setIsCompany, vipPackage = _a.vipPackage, setVipPackage = _a.setVipPackage;
    return (react_1["default"].createElement("div", { className: "grid grid-cols-2 gap-4" },
        react_1["default"].createElement(DateInputWithLabel, { id: "pickup-date", label: "Pickup Date", value: pickupDate, onChange: setPickupDate }),
        react_1["default"].createElement(DateInputWithLabel, { id: "delivery-date", label: "Delivery Date", value: deliveryDate, onChange: setDeliveryDate })));
};
var AddressSection = function (_a) {
    var prefix = _a.prefix, street = _a.street, setStreet = _a.setStreet, buildingNumber = _a.buildingNumber, setBuildingNumber = _a.setBuildingNumber, apartmentNumber = _a.apartmentNumber, setApartmentNumber = _a.setApartmentNumber, city = _a.city, setCity = _a.setCity, zipCode = _a.zipCode, setZipCode = _a.setZipCode, country = _a.country, setCountry = _a.setCountry;
    return (react_1["default"].createElement("div", { className: "grid grid-cols-2 gap-4" },
        react_1["default"].createElement(TextInputWithLabel, { id: prefix + "-address-street", label: "Street", value: street, onChange: function (e) { return setStreet(e.target.value); } }),
        react_1["default"].createElement(TextInputWithLabel, { id: prefix + "-address-building-number", label: "Building Number", value: buildingNumber, onChange: function (e) { return setBuildingNumber(e.target.value); } }),
        react_1["default"].createElement(TextInputWithLabel, { id: prefix + "-address-apartment-number", label: "Apartment Number (optional)", value: apartmentNumber, onChange: function (e) { return setApartmentNumber(e.target.value); } }),
        react_1["default"].createElement(TextInputWithLabel, { id: prefix + "-address-city", label: "City", value: city, onChange: function (e) { return setCity(e.target.value); } }),
        react_1["default"].createElement(TextInputWithLabel, { id: prefix + "-address-zip-code", label: "Zip Code", value: zipCode, onChange: function (e) { return setZipCode(e.target.value); } }),
        react_1["default"].createElement(TextInputWithLabel, { id: prefix + "-address-country", label: "Country", value: country, onChange: function (e) { return setCountry(e.target.value); } })));
};
function CreateInquiry() {
    var _a = react_1["default"].useState(true), loading = _a[0], setLoading = _a[1];
    var _b = react_1["default"].useState(true), formIsValid = _b[0], setFormIsValid = _b[1];
    var _c = react_1["default"].useState(""), description = _c[0], setDescription = _c[1];
    var _d = react_1["default"].useState(0), packageWidth = _d[0], setPackageWidth = _d[1];
    var _e = react_1["default"].useState(0), packageHeight = _e[0], setPackageHeight = _e[1];
    var _f = react_1["default"].useState(0), packageDepth = _f[0], setPackageDepth = _f[1];
    var _g = react_1["default"].useState(0), packageWeight = _g[0], setPackageWeight = _g[1];
    var _h = react_1["default"].useState(""), sourceAddressStreet = _h[0], setSourceAddressStreet = _h[1];
    var _j = react_1["default"].useState(""), sourceAddressBuildingNumber = _j[0], setSourceAddressBuildingNumber = _j[1];
    var _k = react_1["default"].useState(""), sourceAddressApartmentNumber = _k[0], setSourceAddressApartmentNumber = _k[1];
    var _l = react_1["default"].useState(""), sourceAddressCity = _l[0], setSourceAddressCity = _l[1];
    var _m = react_1["default"].useState(""), sourceAddressZipCode = _m[0], setSourceAddressZipCode = _m[1];
    var _o = react_1["default"].useState(""), sourceAddressCountry = _o[0], setSourceAddressCountry = _o[1];
    var _p = react_1["default"].useState(""), destinationAddressStreet = _p[0], setDestinationAddressStreet = _p[1];
    var _q = react_1["default"].useState(""), destinationAddressBuildingNumber = _q[0], setDestinationAddressBuildingNumber = _q[1];
    var _r = react_1["default"].useState(""), destinationAddressApartmentNumber = _r[0], setDestinationAddressApartmentNumber = _r[1];
    var _s = react_1["default"].useState(""), destinationAddressCity = _s[0], setDestinationAddressCity = _s[1];
    var _t = react_1["default"].useState(""), destinationAddressZipCode = _t[0], setDestinationAddressZipCode = _t[1];
    var _u = react_1["default"].useState(""), destinationAddressCountry = _u[0], setDestinationAddressCountry = _u[1];
    var _v = react_1["default"].useState(""), pickupDate = _v[0], setPickupDate = _v[1];
    var _w = react_1["default"].useState(""), deliveryDate = _w[0], setDeliveryDate = _w[1];
    var _x = react_1["default"].useState("low"), priority = _x[0], setPriority = _x[1];
    var _y = react_1["default"].useState(false), atWeekend = _y[0], setAtWeekend = _y[1];
    var _z = react_1["default"].useState(false), isCompany = _z[0], setIsCompany = _z[1];
    var _0 = react_1["default"].useState(false), vipPackage = _0[0], setVipPackage = _0[1];
    var _1 = react_1["default"].useState(""), error = _1[0], setError = _1[1];
    var _2 = react_1["default"].useState(""), success = _2[0], setSuccess = _2[1];
    var _3 = react_1["default"].useState(false), inquiryLoading = _3[0], setInquiryLoading = _3[1];
    var validateForm = function () {
        // Example validation logic
        return description !== '' && packageWidth > 0 && packageHeight > 0 && packageDepth > 0 && packageWeight > 0;
    };
    var onSubmit = function (e) {
        e.preventDefault();
        var isFormValid = validateForm();
        setFormIsValid(isFormValid);
        if (inquiryLoading)
            return;
        setError("");
        setSuccess("");
        setInquiryLoading(true);
        api_1.createInquiry(description, packageWidth, packageHeight, packageDepth, packageWeight, sourceAddressStreet, sourceAddressBuildingNumber, sourceAddressApartmentNumber, sourceAddressCity, sourceAddressZipCode, sourceAddressCountry, destinationAddressStreet, destinationAddressBuildingNumber, destinationAddressApartmentNumber, destinationAddressCity, destinationAddressZipCode, destinationAddressCountry, priority, atWeekend, pickupDate + "T00:00:00.000Z", deliveryDate + "T00:00:00.000Z", isCompany, vipPackage)
            .then(function (res) {
            var _a;
            setSuccess(((_a = res === null || res === void 0 ? void 0 : res.data) === null || _a === void 0 ? void 0 : _a.message) || "Inquiry created successfully!");
            setDescription("");
            setPackageWidth(0);
            setPackageHeight(0);
            setPackageDepth(0);
            setPackageWeight(0);
            setSourceAddressCity("");
            setSourceAddressBuildingNumber("");
            setSourceAddressApartmentNumber("");
            setSourceAddressCity("");
            setSourceAddressZipCode("");
            setSourceAddressCountry("");
            setDestinationAddressCity("");
            setDestinationAddressBuildingNumber("");
            setDestinationAddressApartmentNumber("");
            setDestinationAddressCity("");
            setDestinationAddressZipCode("");
            setDestinationAddressCountry("");
            setPickupDate("");
            setDeliveryDate("");
            setPriority("low");
            setAtWeekend(false);
            setIsCompany(false);
            setVipPackage(false);
        })["catch"](function (err) {
            var _a, _b;
            setError(((_b = (_a = err === null || err === void 0 ? void 0 : err.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || "Something went wrong!");
        })["finally"](function () {
            setInquiryLoading(false);
        });
    };
    return (react_1["default"].createElement(react_1["default"].Fragment, null,
        loading ? react_1["default"].createElement(loader_1.Loader, null) : null,
        react_1["default"].createElement("div", { className: "container mx-auto px-4" },
            react_1["default"].createElement(header_1.Header, { loading: loading, setLoading: setLoading }),
            react_1["default"].createElement("h1", { className: "mb-2 text-3xl font-bold text-gray-900 dark:text-white" }, "Create an inquiry"),
            react_1["default"].createElement("p", { className: "mb-5" }, "Please fill all fields below and click blue button located at the bottom of this page."),
            react_1["default"].createElement("form", { className: "flex flex-col gap-6 px-10", onSubmit: onSubmit },
                react_1["default"].createElement("div", { className: " gap-6" },
                    react_1["default"].createElement(SectionTitle, { title: "Package Details" }),
                    react_1["default"].createElement(PackageDetailsSection, __assign({}, { packageWidth: packageWidth, setPackageWidth: setPackageWidth, packageHeight: packageHeight, setPackageHeight: setPackageHeight, packageDepth: packageDepth, setPackageDepth: setPackageDepth, packageWeight: packageWeight, setPackageWeight: setPackageWeight })),
                    react_1["default"].createElement(SectionTitle, { title: "Source Address" }),
                    react_1["default"].createElement(AddressSection, { prefix: "source", street: sourceAddressStreet, setStreet: setSourceAddressStreet, buildingNumber: sourceAddressBuildingNumber, setBuildingNumber: setSourceAddressBuildingNumber, apartmentNumber: sourceAddressApartmentNumber, setApartmentNumber: setSourceAddressApartmentNumber, city: sourceAddressCity, setCity: setSourceAddressCity, zipCode: sourceAddressZipCode, setZipCode: setSourceAddressZipCode, country: sourceAddressCountry, setCountry: setSourceAddressCountry }),
                    react_1["default"].createElement(SectionTitle, { title: "Destination Address" }),
                    react_1["default"].createElement(AddressSection, { prefix: "destination", street: destinationAddressStreet, setStreet: setDestinationAddressStreet, buildingNumber: destinationAddressBuildingNumber, setBuildingNumber: setDestinationAddressBuildingNumber, apartmentNumber: destinationAddressApartmentNumber, setApartmentNumber: setDestinationAddressApartmentNumber, city: destinationAddressCity, setCity: setDestinationAddressCity, zipCode: destinationAddressZipCode, setZipCode: setDestinationAddressZipCode, country: destinationAddressCountry, setCountry: setDestinationAddressCountry }),
                    react_1["default"].createElement(SectionTitle, { title: "Delivery Details" }),
                    react_1["default"].createElement(DeliveryDetailsSection, __assign({}, { pickupDate: pickupDate, setPickupDate: setPickupDate, deliveryDate: deliveryDate, setDeliveryDate: setDeliveryDate, priority: priority, setPriority: setPriority, atWeekend: atWeekend, setAtWeekend: setAtWeekend, isCompany: isCompany, setIsCompany: setIsCompany, vipPackage: vipPackage, setVipPackage: setVipPackage })),
                    react_1["default"].createElement(ShortDescriptionSection, { description: description, setDescription: setDescription }),
                    react_1["default"].createElement(SubmitButton, { inquiryLoading: inquiryLoading }),
                    react_1["default"].createElement(Alerts, { error: error, success: success }))),
            success ? (react_1["default"].createElement(flowbite_react_1.Alert, { color: "success", icon: hi_1.HiCheckCircle, className: "mb-3" },
                react_1["default"].createElement("span", null,
                    react_1["default"].createElement("span", { className: "font-bold" }, "Success!"),
                    " ",
                    success))) : null,
            react_1["default"].createElement(footer_1.Footer, null))));
}
exports["default"] = CreateInquiry;
