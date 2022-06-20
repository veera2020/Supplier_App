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
  Radio,
  RadioGroup,
  Stack,
} from "@chakra-ui/react";
import Geocode, { setLanguage } from "react-geocode";
//components
import Forms from "../controls/Forms";
import FormikErrorMessage from "../controls/FormikErrorMessage";
import InputFields from "../controls/InputFields";
import axios from "../../axios";

//function init
const AddRequirement = ({ setreload, reload }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [errorMessage, seterrorMessage] = useState("");
  const [username, setusername] = useState("");
  const [lat, setlat] = useState("");
  const [lng, setlng] = useState("");
  const [errorshow, seterrorshow] = useState("");

  seterrorshow;
  //Formik regex
  const Namepattern = /^[a-zA-Z\s.]*$/;
  const addressregex = /^[a-zA-Z0-9\s\,\''\-]*$/;
  //geocode for mapview
  Geocode.setApiKey("AIzaSyDoYhbYhtl9HpilAZSy8F_JHmzvwVDoeHI");
  Geocode.setLanguage("en");
  Geocode.setRegion("es");
  Geocode.setLocationType("ROOFTOP");
  Geocode.enableDebug();
  const getlatlng = (e) => {
    // Get latitude & longitude from address.
    Geocode.fromAddress(e.target.value).then(
      (response) => {
        const { lat, lng } = response.results[0].geometry.location;
        setlat(lat);
        setlng(lng);
      },
      (error) => {
        console.error(error);
        seterrorshow("Enter Vaild Address");
      }
    );
  };
  //Formik InitialValue
  const initialvalue = {
    type: "",
    name: "",
    buyerpname: "",
    minrange: "",
    maxrange: "",
    minprice: "",
    maxprice: "",
    pdelivery: "",
    deliverylocation: "",
    buyerdeliverydate: "",
    supplierpname: "",
    stocklocation: "",
    stockposition: "",
    stockavailabilitydate: "",
    packtype: "",
    expquantity: "",
    expprice: "",
    paymentmode: "",
  };
  //formik validation
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialvalue,
    validationSchema: Yup.object().shape({
      // type: Yup.string(),
      // name: Yup.string(),
      // buyerpname: Yup.string().matches(Namepattern, "Alphabets only allowed"),
      // minrange: Yup.number(),
      // maxrange: Yup.number(),
      // minprice: Yup.number(),
      // maxprice: Yup.number(),
      // pdelivery: Yup.string(),
      // deliverylocation: Yup.string().matches(
      //   addressregex,
      //   "Enter Vaild Location"
      // ),
      // buyerdeliverydate: Yup.string().required(),
      // supplierpname: Yup.string().matches(
      //   Namepattern,
      //   "Alphabets only allowed"
      // ),
      // stocklocation: Yup.string().matches(addressregex, "Enter Vaild Location"),
      // stockposition: Yup.string(),
      // stockavailabilitydate: Yup.string().required(),
      // packtype: Yup.string().matches(Namepattern, "Alphabets only allowed"),
      // expprice: Yup.number(),
      // expquantity: Yup.number(),
      // paymentmode: Yup.string(),
    }),
    onSubmit: (values) => {
      //date
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, "0");
      var mm = String(today.getMonth() + 1).padStart(2, "0");
      var yyyy = today.getFullYear();
      today = dd + "-" + mm + "-" + yyyy;
      const data = {
        type: values.type,
        name: values.name,
        buyerpname: values.buyerpname,
        minrange: values.minrange,
        maxrange: values.maxrange,
        minprice: values.minprice,
        maxprice: values.maxprice,
        pdelivery: values.pdelivery,
        deliverylocation: values.deliverylocation,
        buyerdeliverydate: values.buyerdeliverydate,
        supplierpname: values.supplierpname,
        stocklocation: values.stocklocation,
        stockposition: values.stockposition,
        stockavailabilitydate: values.stockavailabilitydate,
        packtype: values.packtype,
        expprice: values.expprice,
        expquantity: values.expquantity,
        paymentmode: values.paymentmode,
        advance: values.advance,
        date: today,
        latitude: lat,
        longitude: lng,
      };
      axios
        .post("/v1/postorder", data)
        .then((res) => {
          console.log(res.data);
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
  //getusername
  const getusername = (e) => {
    axios
      .get(`/v1/supplierBuyer/type/getName/${e.target.value}`)
      .then((res) => setusername(res.data));
  };
  return (
    <>
      <Button onClick={onOpen} colorScheme="blue">
        Add
      </Button>
      <Modal isOpen={isOpen} size="xl" onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Post Requirements</ModalHeader>
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
            {errorshow && (
              <div className="pb-5">
                <Alert status="error">
                  <AlertIcon />
                  <AlertDescription>{errorshow}</AlertDescription>
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
                    getusername(e);
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
                  <option value="Supplier">Supplier</option>
                  <option value="Buyer">Buyer</option>
                  <option value="Both">Both</option>
                </select>
              </div>
              {formik.touched.type && formik.errors.type ? (
                <FormikErrorMessage>{formik.errors.type}</FormikErrorMessage>
              ) : null}

              <div className="flex flex-col gap-2">
                <label className="font-semibold">
                  Name
                  <span className="text-secondary pb-2">*</span>
                </label>
                <select
                  name="name"
                  value={formik.values.name}
                  onChange={(e) => {
                    formik.setFieldValue("name", e.target.value);
                    e.target.classList.add("change_color");
                  }}
                  onBlur={formik.handleBlur}
                  style={{ outline: 0 }}
                  className={
                    formik.touched.name && formik.errors.name
                      ? "input-primary bg-whitecolor focus-outline-none ring-2 ring-secondary border-none experience"
                      : "input-primary bg-whitecolor focus-outline-none experience"
                  }
                >
                  <option>Select</option>
                  {username &&
                    username.map((item, index) => (
                      <option key={index} value={item._id}>
                        {item.primaryContactName}
                      </option>
                    ))}
                </select>
              </div>
              {formik.touched.name && formik.errors.name ? (
                <FormikErrorMessage>{formik.errors.name}</FormikErrorMessage>
              ) : null}
              {formik.values.type === "Both" ? (
                <>
                  <div className="flex flex-col gap-2">
                    <label className="font-semibold">
                      Stock (Product Delivery)
                      <span className="text-secondary pb-2">*</span>
                    </label>
                    <RadioGroup>
                      <Stack
                        direction="row"
                        name="selectboth"
                        value={formik.values.selectboth || ""}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      >
                        <Radio
                          name="selectboth"
                          value="Supplier"
                          className={
                            formik.touched.selectboth &&
                            formik.errors.selectboth
                              ? "ring-2 ring-secondary border-none"
                              : ""
                          }
                        >
                          Post your stock
                        </Radio>
                        <Radio
                          name="selectboth"
                          className={
                            formik.touched.selectboth &&
                            formik.errors.selectboth
                              ? "ring-2 ring-secondary border-none"
                              : ""
                          }
                          value="Buyer"
                        >
                          Post your need
                        </Radio>
                      </Stack>
                    </RadioGroup>
                  </div>
                  {formik.touched.selectboth && formik.errors.selectboth ? (
                    <FormikErrorMessage>
                      {formik.errors.selectboth}
                    </FormikErrorMessage>
                  ) : null}
                </>
              ) : null}
              {formik.values.type === "Buyer" ||
              formik.values.selectboth === "Buyer" ? (
                <>
                  <div className="flex flex-col gap-2">
                    <label className="font-semibold">
                      Product Name
                      <span className="text-secondary pb-2">*</span>
                    </label>
                    <InputFields
                      type="string"
                      name="buyerpname"
                      placeholder="Enter Product Name"
                      value={formik.values.buyerpname || ""}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={
                        formik.touched.buyerpname && formik.errors.buyerpname
                          ? "input-primary ring-2 ring-secondary border-none"
                          : "input-primary"
                      }
                    />
                  </div>
                  {formik.touched.buyerpname && formik.errors.buyerpname ? (
                    <FormikErrorMessage>
                      {formik.errors.buyerpname}
                    </FormikErrorMessage>
                  ) : null}
                  <div className="flex flex-col gap-2">
                    <label className="font-semibold">
                      Quantity Range
                      <span className="text-secondary pb-2">*</span>
                    </label>
                    <div className="flex gap-5">
                      <InputFields
                        type="number"
                        name="minrange"
                        placeholder="Enter Min Range"
                        value={formik.values.minrange || ""}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={
                          formik.touched.minrange && formik.errors.minrange
                            ? "input-primary ring-2 ring-secondary border-none"
                            : "input-primary"
                        }
                      />
                      <InputFields
                        type="number"
                        name="maxrange"
                        placeholder="Enter Max Range"
                        value={formik.values.maxrange || ""}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={
                          formik.touched.maxrange && formik.errors.maxrange
                            ? "input-primary ring-2 ring-secondary border-none"
                            : "input-primary"
                        }
                      />
                    </div>
                  </div>
                  {formik.touched.maxrange && formik.errors.maxrange ? (
                    <FormikErrorMessage>
                      {formik.errors.maxrange}
                    </FormikErrorMessage>
                  ) : null}
                  <div className="flex flex-col gap-2">
                    <label className="font-semibold">
                      Landing Price
                      <span className="text-secondary pb-2">*</span>
                    </label>
                    <div className="flex gap-5">
                      <InputFields
                        type="number"
                        name="minprice"
                        placeholder="Enter Min Price"
                        value={formik.values.minprice || ""}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={
                          formik.touched.minprice && formik.errors.minprice
                            ? "input-primary ring-2 ring-secondary border-none"
                            : "input-primary"
                        }
                      />
                      <InputFields
                        type="number"
                        name="maxprice"
                        placeholder="Enter Max Price"
                        value={formik.values.maxprice || ""}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={
                          formik.touched.maxprice && formik.errors.maxprice
                            ? "input-primary ring-2 ring-secondary border-none"
                            : "input-primary"
                        }
                      />
                    </div>
                  </div>
                  {formik.touched.maxprice && formik.errors.maxprice ? (
                    <FormikErrorMessage>
                      {formik.errors.maxprice}
                    </FormikErrorMessage>
                  ) : null}
                  <div className="flex flex-col gap-2">
                    <label className="font-semibold">
                      Stock (Product Delivery)
                      <span className="text-secondary pb-2">*</span>
                    </label>
                    <RadioGroup>
                      <Stack
                        direction="row"
                        name="pdelivery"
                        value={formik.values.pdelivery || ""}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      >
                        <Radio
                          name="pdelivery"
                          value="Pickup Directly"
                          className={
                            formik.touched.pdelivery && formik.errors.pdelivery
                              ? "ring-2 ring-secondary border-none"
                              : ""
                          }
                        >
                          Pickup Directly
                        </Radio>
                        <Radio
                          name="pdelivery"
                          className={
                            formik.touched.pdelivery && formik.errors.pdelivery
                              ? "ring-2 ring-secondary border-none"
                              : ""
                          }
                          value="Delivery to Location"
                        >
                          Delivery to Location
                        </Radio>
                      </Stack>
                    </RadioGroup>
                  </div>
                  {formik.touched.pdelivery && formik.errors.pdelivery ? (
                    <FormikErrorMessage>
                      {formik.errors.pdelivery}
                    </FormikErrorMessage>
                  ) : null}
                  {formik.values.pdelivery === "Delivery to Location" ? (
                    <>
                      <div className="flex flex-col gap-2">
                        <label className="font-semibold">
                          Delivery Location
                          <span className="text-secondary pb-2">*</span>
                        </label>
                        <InputFields
                          type="string"
                          name="deliverylocation"
                          placeholder="Enter Delivery Location"
                          value={formik.values.deliverylocation || ""}
                          onChange={(e) => {
                            getlatlng(e);
                            formik.handleChange(e);
                          }}
                          onBlur={formik.handleBlur}
                          className={
                            formik.touched.deliverylocation &&
                            formik.errors.deliverylocation
                              ? "input-primary ring-2 ring-secondary border-none"
                              : "input-primary"
                          }
                        />
                      </div>
                      {formik.touched.deliverylocation &&
                      formik.errors.deliverylocation ? (
                        <FormikErrorMessage>
                          {formik.errors.deliverylocation}
                        </FormikErrorMessage>
                      ) : null}
                      <div className="flex flex-col gap-2">
                        <label className="font-semibold">
                          Estimate Delivery Date
                          <span className="text-secondary pb-2">*</span>
                        </label>
                        <input
                          type="date"
                          name="buyerdeliverydate"
                          onChange={(e) => {
                            e.target.classList.add("change_color");
                            formik.setFieldValue(
                              "buyerdeliverydate",
                              e.target.value
                            );
                          }}
                          onBlur={formik.handleBlur}
                          className={
                            formik.touched.buyerdeliverydate &&
                            formik.errors.buyerdeliverydate
                              ? "input-primary ring-2 ring-secondary border-none experience"
                              : "input-primary experience"
                          }
                        />
                        {formik.touched.buyerdeliverydate &&
                        formik.errors.buyerdeliverydate ? (
                          <FormikErrorMessage>
                            {formik.errors.buyerdeliverydate}
                          </FormikErrorMessage>
                        ) : null}
                      </div>
                    </>
                  ) : null}
                  {formik.values.pdelivery === "Pickup Directly" ? (
                    <div className="flex flex-col gap-2">
                      <label className="font-semibold">
                        Estimate Delivery Date
                        <span className="text-secondary pb-2">*</span>
                      </label>
                      <input
                        type="date"
                        name="buyerdeliverydate"
                        onChange={(e) => {
                          e.target.classList.add("change_color");
                          formik.setFieldValue(
                            "buyerdeliverydate",
                            e.target.value
                          );
                        }}
                        onBlur={formik.handleBlur}
                        className={
                          formik.touched.buyerdeliverydate &&
                          formik.errors.buyerdeliverydate
                            ? "input-primary ring-2 ring-secondary border-none experience"
                            : "input-primary experience"
                        }
                      />
                      {formik.touched.buyerdeliverydate &&
                      formik.errors.buyerdeliverydate ? (
                        <FormikErrorMessage>
                          {formik.errors.buyerdeliverydate}
                        </FormikErrorMessage>
                      ) : null}
                    </div>
                  ) : null}
                </>
              ) : null}
              {formik.values.type === "Supplier" ||
              formik.values.selectboth === "Supplier" ? (
                <>
                  <div className="flex flex-col gap-2">
                    <label className="font-semibold">
                      Product Name
                      <span className="text-secondary pb-2">*</span>
                    </label>
                    <InputFields
                      type="string"
                      name="supplierpname"
                      placeholder="Enter Product Name"
                      value={formik.values.supplierpname || ""}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={
                        formik.touched.supplierpname &&
                        formik.errors.supplierpname
                          ? "input-primary ring-2 ring-secondary border-none"
                          : "input-primary"
                      }
                    />
                  </div>
                  {formik.touched.supplierpname &&
                  formik.errors.supplierpname ? (
                    <FormikErrorMessage>
                      {formik.errors.supplierpname}
                    </FormikErrorMessage>
                  ) : null}
                  <div className="flex flex-col gap-2">
                    <label className="font-semibold">
                      Stock Location
                      <span className="text-secondary pb-2">*</span>
                    </label>
                    <InputFields
                      type="string"
                      name="stocklocation"
                      placeholder="Enter Stock Location"
                      value={formik.values.stocklocation || ""}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={
                        formik.touched.stocklocation &&
                        formik.errors.stocklocation
                          ? "input-primary ring-2 ring-secondary border-none"
                          : "input-primary"
                      }
                    />
                  </div>
                  {formik.touched.stocklocation &&
                  formik.errors.stocklocation ? (
                    <FormikErrorMessage>
                      {formik.errors.stocklocation}
                    </FormikErrorMessage>
                  ) : null}
                  <div className="flex flex-col gap-2">
                    <label className="font-semibold">
                      Stock Position
                      <span className="text-secondary pb-2">*</span>
                    </label>
                    <RadioGroup>
                      <Stack
                        direction="row"
                        name="stockposition"
                        value={formik.values.stockposition || ""}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      >
                        <Radio
                          name="stockposition"
                          value="Ready"
                          className={
                            formik.touched.stockposition &&
                            formik.errors.stockposition
                              ? "ring-2 ring-secondary border-none"
                              : ""
                          }
                        >
                          Ready
                        </Radio>
                        <Radio
                          name="stockposition"
                          className={
                            formik.touched.stockposition &&
                            formik.errors.stockposition
                              ? "ring-2 ring-secondary border-none"
                              : ""
                          }
                          value="To be Ploughed"
                        >
                          To be Ploughed
                        </Radio>
                      </Stack>
                    </RadioGroup>
                  </div>
                  {formik.touched.stockposition &&
                  formik.errors.stockposition ? (
                    <FormikErrorMessage>
                      {formik.errors.stockposition}
                    </FormikErrorMessage>
                  ) : null}
                  {formik.values.stockposition === "To be Ploughed" ? (
                    <>
                      <div className="flex flex-col gap-2">
                        <label className="font-semibold">
                          Stock Availability
                          <span className="text-secondary pb-2">*</span>
                        </label>
                        <input
                          type="date"
                          name="stockavailabilitydate"
                          onChange={(e) => {
                            e.target.classList.add("change_color");
                            formik.setFieldValue(
                              "stockavailabilitydate",
                              e.target.value
                            );
                          }}
                          onBlur={formik.handleBlur}
                          className={
                            formik.touched.stockavailabilitydate &&
                            formik.errors.stockavailabilitydate
                              ? "input-primary ring-2 ring-secondary border-none experience"
                              : "input-primary experience"
                          }
                        />
                      </div>
                      {formik.touched.stockavailabilitydate &&
                      formik.errors.stockavailabilitydate ? (
                        <FormikErrorMessage>
                          {formik.errors.stockavailabilitydate}
                        </FormikErrorMessage>
                      ) : null}
                      <div className="flex flex-col gap-2">
                        <label className="font-semibold">
                          Payment Mode
                          <span className="text-secondary pb-2">*</span>
                        </label>
                        <select
                          name="paymentmode"
                          value={formik.values.paymentmode}
                          onChange={(e) => {
                            formik.setFieldValue("paymentmode", e.target.value);
                            e.target.classList.add("change_color");
                          }}
                          onBlur={formik.handleBlur}
                          style={{ outline: 0 }}
                          className={
                            formik.touched.paymentmode &&
                            formik.errors.paymentmode
                              ? "input-primary bg-whitecolor focus-outline-none ring-2 ring-secondary border-none experience"
                              : "input-primary bg-whitecolor focus-outline-none experience"
                          }
                        >
                          <option>Select</option>
                          <option value="Credit">Credit</option>
                          <option value="Advance">Advance</option>
                          <option value="COD">COD</option>
                        </select>
                      </div>
                      {formik.touched.paymentmode &&
                      formik.errors.paymentmode ? (
                        <FormikErrorMessage>
                          {formik.errors.paymentmode}
                        </FormikErrorMessage>
                      ) : null}
                      {formik.values.paymentmode === "Advance" ? (
                        <>
                          <div className="flex flex-col gap-2">
                            <label className="font-semibold">
                              Advance
                              <span className="text-secondary pb-2">*</span>
                            </label>
                            <InputFields
                              type="number"
                              name="advance"
                              placeholder="Enter Advance"
                              value={formik.values.advance || ""}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              className={
                                formik.touched.advance && formik.errors.advance
                                  ? "input-primary ring-2 ring-secondary border-none"
                                  : "input-primary"
                              }
                            />
                          </div>
                          {formik.touched.advance && formik.errors.advance ? (
                            <FormikErrorMessage>
                              {formik.errors.advance}
                            </FormikErrorMessage>
                          ) : null}
                        </>
                      ) : null}
                    </>
                  ) : null}
                  {formik.values.stockposition === "Ready" ? (
                    <>
                      <div className="flex flex-col gap-2">
                        <label className="font-semibold">
                          Pack Type
                          <span className="text-secondary pb-2">*</span>
                        </label>
                        <InputFields
                          type="string"
                          name="packtype"
                          placeholder="Enter Pack Type"
                          value={formik.values.packtype || ""}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className={
                            formik.touched.packtype && formik.errors.packtype
                              ? "input-primary ring-2 ring-secondary border-none"
                              : "input-primary"
                          }
                        />
                      </div>
                      {formik.touched.packtype && formik.errors.packtype ? (
                        <FormikErrorMessage>
                          {formik.errors.packtype}
                        </FormikErrorMessage>
                      ) : null}
                      <div className="flex flex-col gap-2">
                        <label className="font-semibold">
                          Excepted Quantity
                          <span className="text-secondary pb-2">*</span>
                        </label>
                        <InputFields
                          type="number"
                          name="expquantity"
                          placeholder="Enter Excepted Quantity"
                          value={formik.values.expquantity || ""}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className={
                            formik.touched.expquantity &&
                            formik.errors.expquantity
                              ? "input-primary ring-2 ring-secondary border-none"
                              : "input-primary"
                          }
                        />
                      </div>
                      {formik.touched.expquantity &&
                      formik.errors.expquantity ? (
                        <FormikErrorMessage>
                          {formik.errors.expquantity}
                        </FormikErrorMessage>
                      ) : null}
                      <div className="flex flex-col gap-2">
                        <label className="font-semibold">
                          Excepted Price
                          <span className="text-secondary pb-2">*</span>
                        </label>
                        <InputFields
                          type="number"
                          name="expprice"
                          placeholder="Enter Excepted Price"
                          value={formik.values.expprice || ""}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className={
                            formik.touched.expprice && formik.errors.expprice
                              ? "input-primary ring-2 ring-secondary border-none"
                              : "input-primary"
                          }
                        />
                      </div>
                      {formik.touched.expprice && formik.errors.expprice ? (
                        <FormikErrorMessage>
                          {formik.errors.expprice}
                        </FormikErrorMessage>
                      ) : null}
                      <div className="flex flex-col gap-2">
                        <label className="font-semibold">
                          Payment Mode
                          <span className="text-secondary pb-2">*</span>
                        </label>
                        <select
                          name="paymentmode"
                          value={formik.values.paymentmode}
                          onChange={(e) => {
                            formik.setFieldValue("paymentmode", e.target.value);
                            e.target.classList.add("change_color");
                          }}
                          onBlur={formik.handleBlur}
                          style={{ outline: 0 }}
                          className={
                            formik.touched.paymentmode &&
                            formik.errors.paymentmode
                              ? "input-primary bg-whitecolor focus-outline-none ring-2 ring-secondary border-none experience"
                              : "input-primary bg-whitecolor focus-outline-none experience"
                          }
                        >
                          <option>Select</option>
                          <option value="Credit">Credit</option>
                          <option value="Advance">Advance</option>
                          <option value="COD">COD</option>
                        </select>
                      </div>
                      {formik.touched.paymentmode &&
                      formik.errors.paymentmode ? (
                        <FormikErrorMessage>
                          {formik.errors.paymentmode}
                        </FormikErrorMessage>
                      ) : null}
                      {formik.values.paymentmode === "Advance" ? (
                        <>
                          <div className="flex flex-col gap-2">
                            <label className="font-semibold">
                              Advance
                              <span className="text-secondary pb-2">*</span>
                            </label>
                            <InputFields
                              type="number"
                              name="advance"
                              placeholder="Enter Advance"
                              value={formik.values.advance || ""}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              className={
                                formik.touched.advance && formik.errors.advance
                                  ? "input-primary ring-2 ring-secondary border-none"
                                  : "input-primary"
                              }
                            />
                          </div>
                          {formik.touched.advance && formik.errors.advance ? (
                            <FormikErrorMessage>
                              {formik.errors.advance}
                            </FormikErrorMessage>
                          ) : null}
                        </>
                      ) : null}
                    </>
                  ) : null}
                </>
              ) : null}
            </Forms>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={cancelbutton}>
              Cancel
            </Button>
            <Button onClick={formik.handleSubmit} colorScheme="blue">
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default AddRequirement;
