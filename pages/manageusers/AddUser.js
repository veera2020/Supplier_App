/*
 *  Document    : AddUser.js
 *  Author      : Uyarchi
 *  Description : Add New User
 */
import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalFooter,
  ModalBody,
  useDisclosure,
  Alert,
  AlertIcon,
  AlertDescription,
  Button,
} from "@chakra-ui/react";
const { Country, State, City } = require("country-state-city");
//components
import Forms from "../controls/Forms";
import FormikErrorMessage from "../controls/FormikErrorMessage";
import InputFields from "../controls/InputFields";
import axios from "../../axios";
const companytype = [
  { value: "Proprietorship", label: "Proprietorship" },
  { value: "LLP", label: "LLP" },
  { value: "Partnership", label: "Partnership" },
  { value: "Private Limited", label: "Private Limited" },
  { value: "Public Limited", label: "Public Limited" },
  { value: "Individual", label: "Individual" },
  { value: "Others", label: "Others" },
];
//function init
const AddUser = ({ setreload, reload }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [errorMessage, seterrorMessage] = useState("");
  const [statename, setStatename] = useState([]);
  const [statecode, setstatecode] = useState("");
  const [cityname, setcityname] = useState([]);
  const [productslist, setproductslist] = useState([]);
  useEffect(() => {
    axios
      .get("/v1/requirementCollection/thirdPartyApi/product")
      .then((res) => setproductslist(res.data));
  }, []);
  //getcountries
  let allcountries = Country.getAllCountries();
  //getstate
  function getstate(props) {
    let allstate = State.getStatesOfCountry(props.target.value);
    setstatecode(props.target.value);
    setStatename(allstate);
  }
  //getcity
  function getcity(props) {
    let allcity = City.getCitiesOfState(statecode, props.target.value);
    setcityname(allcity);
  }
  //Formik regex
  const Namepattern = /^[a-zA-Z\s.]*$/;
  const pincoderegex = /^(\d{4}|\d{6})$/;
  const gstregex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  //Formik InitialValue
  const initialvalue = {
    type: "",
    tradename: "",
    ctype: "",
    contactname: "",
    contactno: "",
    contactname2: "",
    contactno2: "",
    email: "",
    gstno: "",
    address: "",
    country: "",
    state: "",
    district: "",
    pincode: "",
    location: "",
    products: "",
  };
  //formik validation
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialvalue,
    validationSchema: Yup.object().shape({
      // type: Yup.string().required("Select any Type"),
      // tradename: Yup.string()
      //   .required("Enter Trade Name")
      //   .matches(Namepattern, "Alphabets only allowed"),
      // contactname: Yup.string()
      //   .required("Enter Primary Contact Name")
      //   .matches(Namepattern, "Alphabets only allowed"),
      // contactno: Yup.number().min(8).required("Enter Primary Contact No"),
      // contactname2: Yup.string().matches(Namepattern, "Alphabets only allowed"),
      // contactno2: Yup.number().min(8),
      // email: Yup.string().email("Invaild Email Format").required("Enter Email"),
      // gstno: Yup.string()
      //   .required("Enter GST No")
      //   .matches(gstregex, "Enter Vaild GST No"),
      // address: Yup.string().required("Fill Your Address"),
      // country: Yup.string().required("Select any Country Name"),
      // state: Yup.string().required("Select any State Name"),
      // district: Yup.string().required("Select any District Name"),
      // pincode: Yup.string()
      //   .required("Enter Pincode")
      //   .matches(pincoderegex, "Enter Vaild Pincode"),
      // location: Yup.string().required("Enter Your Location"),
      // products: Yup.string().required("Select any Products"),
    }),
    onSubmit: (values) => {
      console.log(values, "hema");
      const data = {
        type: values.type,
        tradeName: values.tradename,
        companytype: values.ctype,
        primaryContactNumber: values.contactno,
        primaryContactName: values.contactname,
        secondaryContactName: values.contactname2,
        secondaryContactNumber: values.contactno2,
        RegisteredAddress: values.address,
        countries: values.country,
        state: values.state,
        district: values.district,
        gpsLocat: values.location,
        gstNo: values.gstno,
        email: values.email,
        pinCode: values.pincode,
        productDealingWith: values.products,
        createdBy: "telecaller",
      };
      axios
        .post("/v1/supplier", data)
        .then((res) => {
          setreload(!reload);
          onClose();
          formik.resetForm();
        })
        .catch((error) => {
          if (error.response) {
            console.log(error.response);
            seterrorMessage(error.response.data.message);
          }
        });
    },
  });
  const cancelbutton = () => {
    onClose();
    formik.resetForm();
  };

  return (
    <>
      <Button onClick={onOpen} colorScheme="blue">
        Add
      </Button>
      <Modal isOpen={isOpen} size="xl" onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add User</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {errorMessage && (
              <div className="pb-5">
                <Alert status="error">
                  <AlertIcon />
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              </div>
            )}
            <Forms className="space-y-2">
              <div className="flex flex-col gap-2">
                <label className="font-semibold">
                  Type
                  <span className="text-secondary pb-2">*</span>
                </label>
                <select
                  name="type"
                  value={formik.values.type}
                  onChange={(e) => {
                    formik.setFieldValue("type", e.target.value);
                    e.target.classList.add("change_color");
                  }}
                  onBlur={formik.handleBlur}
                  style={{ outline: 0 }}
                  className={
                    formik.touched.type && formik.errors.type
                      ? "input-primary bg-whitecolor focus-outline-none ring-2 ring-secondary border-none experience"
                      : "input-primary bg-whitecolor focus-outline-none experience"
                  }
                >
                  <option>Select</option>
                  <option value="supplier">Supplier</option>
                  <option value="buyer">Buyer</option>
                </select>
              </div>
              {formik.touched.type && formik.errors.type ? (
                <FormikErrorMessage>{formik.errors.type}</FormikErrorMessage>
              ) : null}
              <div className="flex flex-col gap-2">
                <label className="font-semibold">
                  Trade Name
                  <span className="text-secondary pb-2">*</span>
                </label>
                <InputFields
                  type="string"
                  name="tradename"
                  placeholder="Enter Trade Name"
                  value={formik.values.tradename || ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={
                    formik.touched.tradename && formik.errors.tradename
                      ? "input-primary ring-2 ring-secondary border-none"
                      : "input-primary"
                  }
                />
              </div>
              {formik.touched.tradename && formik.errors.tradename ? (
                <FormikErrorMessage>
                  {formik.errors.tradename}
                </FormikErrorMessage>
              ) : null}
              <div className="flex flex-col gap-2">
                <label className="font-semibold">
                  Company Type
                  <span className="text-secondary pb-2">*</span>
                </label>
                <select
                  name="ctype"
                  value={formik.values.ctype}
                  onChange={(e) => {
                    formik.setFieldValue("ctype", e.target.value);
                    e.target.classList.add("change_color");
                  }}
                  onBlur={formik.handleBlur}
                  style={{ outline: 0 }}
                  className={
                    formik.touched.ctype && formik.errors.ctype
                      ? "input-primary bg-whitecolor focus-outline-none ring-2 ring-secondary border-none experience"
                      : "input-primary bg-whitecolor focus-outline-none experience"
                  }
                >
                  <option>Select</option>
                  {companytype &&
                    companytype.map((item, index) => (
                      <option key={index} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                </select>
              </div>
              {formik.touched.ctype && formik.errors.ctype ? (
                <FormikErrorMessage>{formik.errors.ctype}</FormikErrorMessage>
              ) : null}
              <div className="flex flex-col gap-2">
                <label className="font-semibold">
                  Primary Contact Name
                  <span className="text-secondary pb-2">*</span>
                </label>
                <InputFields
                  type="string"
                  name="contactname"
                  placeholder="Enter Primary Contact Name"
                  value={formik.values.contactname || ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={
                    formik.touched.contactname && formik.errors.contactname
                      ? "input-primary ring-2 ring-secondary border-none"
                      : "input-primary"
                  }
                />
              </div>
              {formik.touched.contactname && formik.errors.contactname ? (
                <FormikErrorMessage>
                  {formik.errors.contactname}
                </FormikErrorMessage>
              ) : null}
              <div className="flex flex-col gap-2">
                <label className="font-semibold">
                  Primary Contact No
                  <span className="text-secondary pb-2">*</span>
                </label>
                <InputFields
                  type="number"
                  name="contactno"
                  placeholder="Enter Primary Contact No"
                  value={formik.values.contactno || ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={
                    formik.touched.contactno && formik.errors.contactno
                      ? "input-primary ring-2 ring-secondary border-none"
                      : "input-primary"
                  }
                />
              </div>
              {formik.touched.contactno && formik.errors.contactno ? (
                <FormikErrorMessage>
                  {formik.errors.contactno}
                </FormikErrorMessage>
              ) : null}
              <div className="flex flex-col gap-2">
                <label className="font-semibold">Secondary Contact Name</label>
                <InputFields
                  type="string"
                  name="contactname2"
                  placeholder="Enter Secondary Contact Name"
                  value={formik.values.contactname2 || ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="input-primary"
                />
              </div>
              {formik.touched.contactname2 && formik.errors.contactname2 ? (
                <FormikErrorMessage>
                  {formik.errors.contactname2}
                </FormikErrorMessage>
              ) : null}
              <div className="flex flex-col gap-2">
                <label className="font-semibold">Secondary Contact No</label>
                <InputFields
                  type="number"
                  name="contactno2"
                  placeholder="Enter Secondary Contact No"
                  value={formik.values.contactno2 || ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="input-primary"
                />
              </div>
              {formik.touched.contactno2 && formik.errors.contactno2 ? (
                <FormikErrorMessage>
                  {formik.errors.contactno2}
                </FormikErrorMessage>
              ) : null}
              <div className="flex flex-col gap-2">
                <label className="font-semibold">
                  Email
                  <span className="text-secondary pb-2">*</span>
                </label>
                <InputFields
                  type="string"
                  name="email"
                  placeholder="Enter Email"
                  value={formik.values.email || ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={
                    formik.touched.email && formik.errors.email
                      ? "input-primary ring-2 ring-secondary border-none"
                      : "input-primary"
                  }
                />
              </div>
              {formik.touched.email && formik.errors.email ? (
                <FormikErrorMessage>{formik.errors.email}</FormikErrorMessage>
              ) : null}
              <div className="flex flex-col gap-2">
                <label className="font-semibold">
                  GST No
                  <span className="text-secondary pb-2">*</span>
                </label>
                <InputFields
                  type="string"
                  name="gstno"
                  placeholder="Enter GST No"
                  value={formik.values.gstno || ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={
                    formik.touched.gstno && formik.errors.gstno
                      ? "input-primary ring-2 ring-secondary border-none"
                      : "input-primary"
                  }
                />
              </div>
              {formik.touched.gstno && formik.errors.gstno ? (
                <FormikErrorMessage>{formik.errors.gstno}</FormikErrorMessage>
              ) : null}
              <div className="flex flex-col gap-2">
                <label className="font-semibold">
                  Registered Address
                  <span className="text-secondary pb-2">*</span>
                </label>
                <InputFields
                  type="string"
                  name="address"
                  placeholder="Enter Address"
                  value={formik.values.address || ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={
                    formik.touched.address && formik.errors.address
                      ? "input-primary ring-2 ring-secondary border-none"
                      : "input-primary"
                  }
                />
              </div>
              {formik.touched.address && formik.errors.address ? (
                <FormikErrorMessage>{formik.errors.address}</FormikErrorMessage>
              ) : null}
              <div className="flex flex-col gap-2 pb-2">
                <label className="items-center font-semibold">
                  Country
                  <span className="text-secondary">*</span>
                </label>
                <select
                  name="country"
                  id="country_select"
                  onChange={(e) => {
                    var country = document.getElementById("country_select");
                    let x =
                      country.options[
                        country.options.selectedIndex
                      ].getAttribute("data");
                    console.log(x);
                    formik.setFieldValue("country", x);
                    getstate(e);
                    e.target.classList.add("change_color");
                  }}
                  onBlur={formik.handleBlur}
                  style={{ outline: 0 }}
                  className={
                    formik.touched.country && formik.errors.country
                      ? "input-primary bg-whitecolor focus-outline-none ring-2 ring-secondary border-none experience"
                      : "input-primary bg-whitecolor focus-outline-none experience"
                  }
                >
                  <option>Select country</option>
                  {allcountries &&
                    allcountries.map((item, index) => (
                      <option key={index} value={item.isoCode} data={item.name}>
                        {item.name}
                      </option>
                    ))}
                </select>
              </div>
              {formik.touched.country && formik.errors.country ? (
                <FormikErrorMessage>{formik.errors.country}</FormikErrorMessage>
              ) : null}
              <div className="flex flex-col gap-2 pb-2">
                <label className="items-center font-semibold">
                  State
                  <span className="text-secondary">*</span>
                </label>
                <select
                  name="state"
                  id="state_select"
                  onChange={(e) => {
                    var state = document.getElementById("state_select");
                    let x =
                      state.options[state.options.selectedIndex].getAttribute(
                        "data"
                      );
                    console.log(x);
                    formik.setFieldValue("state", x);
                    getcity(e);
                    e.target.classList.add("change_color");
                  }}
                  onBlur={formik.handleBlur}
                  style={{ outline: 0 }}
                  className={
                    formik.touched.state && formik.errors.state
                      ? "input-primary bg-whitecolor focus-outline-none ring-2 ring-secondary border-none experience"
                      : "input-primary bg-whitecolor focus-outline-none experience"
                  }
                >
                  <option>Select State</option>
                  {statename &&
                    statename.map((item, index) => (
                      <option key={index} value={item.isoCode} data={item.name}>
                        {item.name}
                      </option>
                    ))}
                </select>
              </div>
              {formik.touched.state && formik.errors.state ? (
                <FormikErrorMessage>{formik.errors.state}</FormikErrorMessage>
              ) : null}
              <div className="flex flex-col gap-2 pb-2">
                <label className="items-center font-semibold">
                  District
                  <span className="text-secondary">*</span>
                </label>
                <select
                  name="district"
                  value={formik.values.district}
                  onChange={(e) => {
                    formik.setFieldValue("district", e.target.value);
                    e.target.classList.add("change_color");
                  }}
                  onBlur={formik.handleBlur}
                  style={{ outline: 0 }}
                  className={
                    formik.touched.district && formik.errors.district
                      ? "input-primary bg-whitecolor focus-outline-none ring-2 ring-secondary border-none experience"
                      : "input-primary bg-whitecolor focus-outline-none experience"
                  }
                >
                  <option>Select District</option>
                  {cityname &&
                    cityname.map((item, index) => (
                      <option key={index} value={item.name}>
                        {item.name}
                      </option>
                    ))}
                </select>
              </div>
              {formik.touched.district && formik.errors.district ? (
                <FormikErrorMessage>
                  {formik.errors.district}
                </FormikErrorMessage>
              ) : null}
              <div className="flex gap-2 flex-col">
                <label className="font-semibold">
                  Pincode
                  <span className="text-secondary pb-2">*</span>
                </label>
                <InputFields
                  type="number"
                  name="pincode"
                  placeholder="Enter Pincode"
                  value={formik.values.pincode || ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={
                    formik.touched.pincode && formik.errors.pincode
                      ? "input-primary ring-2 ring-secondary border-none"
                      : "input-primary"
                  }
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-semibold">
                  Location
                  <span className="text-secondary pb-2">*</span>
                </label>
                <InputFields
                  type="string"
                  name="location"
                  placeholder="Enter Location"
                  value={formik.values.location || ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={
                    formik.touched.location && formik.errors.location
                      ? "input-primary ring-2 ring-secondary border-none"
                      : "input-primary"
                  }
                />
              </div>
              {formik.touched.location && formik.errors.location ? (
                <FormikErrorMessage>
                  {formik.errors.location}
                </FormikErrorMessage>
              ) : null}
              <div className="flex flex-col gap-2">
                <label className="font-semibold">
                  Product Dealing with
                  <span className="text-secondary pb-2">*</span>
                </label>
                <select
                  name="products"
                  onChange={(e) => {
                    formik.setFieldValue("products", e.target.value);
                    e.target.classList.add("change_color");
                  }}
                  onBlur={formik.handleBlur}
                  style={{ outline: 0 }}
                  className={
                    formik.touched.products && formik.errors.products
                      ? "input-primary bg-whitecolor focus-outline-none ring-2 ring-secondary border-none experience"
                      : "input-primary bg-whitecolor focus-outline-none experience"
                  }
                >
                  <option>Select Products</option>
                  {productslist &&
                    productslist.map((item, index) => (
                      <option key={index} value={item.productTitle}>
                        {item.productTitle}
                      </option>
                    ))}
                </select>
              </div>
              {formik.touched.products && formik.errors.products ? (
                <FormikErrorMessage>
                  {formik.errors.products}
                </FormikErrorMessage>
              ) : null}
            </Forms>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={cancelbutton}>
              Cancel
            </Button>
            <Button onClick={formik.handleSubmit} colorScheme="blue">
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default AddUser;
