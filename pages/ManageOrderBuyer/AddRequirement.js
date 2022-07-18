/*
 *  Document    : AddRequirementForBuyer.js
 *  Author      : Uyarchi
 *  Description : Add New User For Buyer
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
const AddRequirementForBuyer = ({ setreload, reload }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [errorMessage, seterrorMessage] = useState("");
  const [username, setusername] = useState("");
  const [blat, setblat] = useState("");
  const [blng, setblng] = useState("");
  const [errorshow, seterrorshow] = useState("");
  const [buyerId, setBuyerId] = useState("");

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
  // Get latitude & longitude from buyer address.
  const bgetlatlng = (e) => {
    Geocode.fromAddress(e.target.value).then(
      (response) => {
        const { lat, lng } = response.results[0].geometry.location;
        setblat(lat);
        setblng(lng);
        console.log(lat, lng);
      },
      (error) => {
        console.error(error);
        seterrorshow("Enter Vaild Address");
      }
    );
  };
  //Formik InitialValue
  const initialvalue = {
    type: "uyer",
    name: "",
    buyerpname: "",
    minrange: "",
    maxrange: "",
    minprice: "",
    maxprice: "",
    pdelivery: "",
    deliverylocation: "",
    buyerdeliverydate: "",
    buyerdeliverytime: "",
  };
  //formik validation
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialvalue,
    validationSchema: Yup.object().shape({
      buyerpname: Yup.string(),
      minrange: Yup.number(),
      maxrange: Yup.number(),
      minprice: Yup.number(),
      maxprice: Yup.number(),
      pdelivery: Yup.string(),
      deliverylocation: Yup.string(),
      buyerdeliverydate: Yup.string(),
      buyerdeliverytime: Yup.string(),
    }),
    onSubmit: (values) => {
      console.log(values);
      const locale = "en";
      var today = new Date();
      const totime = today.toLocaleTimeString(locale, {
        hour: "numeric",
        hour12: false,
        minute: "numeric",
      });
      console.log(totime);
      var dd = String(today.getDate()).padStart(2, "0");
      var mm = String(today.getMonth() + 1).padStart(2, "0");
      var yyyy = today.getFullYear();
      today = dd + "-" + mm + "-" + yyyy;
      // convert time string to number
      var a = values.buyerdeliverytime;
      a = a.replace(/\:/g, "");
      const deleveryDate = parseInt(a);
      var b = totime;
      b = b.replace(/\:/g, "");
      const time = parseInt(b);
      const data = {
        requirementAddBy: "telecaller",
        userId: buyerId,
        product: values.buyerpname.toLowerCase(),
        minrange: values.minrange,
        maxrange: values.maxrange,
        minprice: values.minprice,
        maxprice: values.maxprice,
        pdelivery: values.pdelivery.toLowerCase(),
        deliverylocation: values.deliverylocation.toLowerCase(),
        deliveryDate: values.buyerdeliverydate,
        deliveryTime: deleveryDate,
        lat: blat,
        lang: blng,
        date: today,
        time: parseFloat(totime),
        status: "",
        matchesStatus: "",
        interestCount: "",
      };
      console.log(data);
      axios
        .post("/v1/requirementCollectionBS/Buyer", data)
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
  const Submit = () => {
    let values = formik.values;
    const locale = "en";
    var today = new Date();
    const totime = today.toLocaleTimeString(locale, {
      hour: "numeric",
      hour12: false,
      minute: "numeric",
    });
    console.log(totime);
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0");
    var yyyy = today.getFullYear();
    today = dd + "-" + mm + "-" + yyyy;
    // convert time string to number
    var a = values.buyerdeliverytime;
    a = a.replace(/\:/g, "");
    const deleveryDate = parseInt(a);
    var b = totime;
    b = b.replace(/\:/g, "");
    const time = parseInt(b);
    const data = {
      requirementAddBy: "telecaller",
      userId: buyerId,
      product: values.buyerpname.toLowerCase(),
      minrange: values.minrange,
      maxrange: values.maxrange,
      minprice: values.minprice,
      maxprice: values.maxprice,
      pdelivery: values.pdelivery.toLowerCase(),
      deliverylocation: values.deliverylocation.toLowerCase(),
      deliveryDate: values.buyerdeliverydate,
      deliveryTime: deleveryDate,
      lat: blat,
      lang: blng,
      date: today,
      time: parseFloat(totime),
      status: "",
      matchesStatus: "",
      interestCount: "",
    };
    console.log(data);
    axios
      .post("/v1/requirementCollectionBS/Buyer", data)
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
  };
  const cancelbutton = () => {
    onClose();
    seterrorshow("");
    formik.resetForm();
  };
  useEffect(() => {
    axios
      .get(`/v1/supplier/type/getName/buyer`)
      .then((res) => setusername(res.data));
  }, []);
  return (
    <>
      <Button onClick={onOpen} colorScheme="blue">
        Add Buyer Requirement
      </Button>
      <Modal isOpen={isOpen} size="xl" onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Buyer Post Requirement</ModalHeader>
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
                  Name
                  <span className="text-secondary pb-2">*</span>
                </label>
                <select
                  name="name"
                  value={formik.values.name}
                  onChange={(e) => {
                    formik.setFieldValue("name", e.target.value);
                    e.target.classList.add("change_color");
                    setBuyerId(e.target.value);
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
                  <label className="font-semibold m-2">To</label>
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
                  Product Price
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
                  <label className="font-semibold m-2">To</label>
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
                  Delivery Location
                  <span className="text-secondary pb-2">*</span>
                </label>
                <InputFields
                  type="string"
                  autoComplete="off"
                  name="deliverylocation"
                  placeholder="Enter Delivery Location"
                  value={formik.values.deliverylocation || ""}
                  onChange={(e) => {
                    formik.handleChange(e);
                    seterrorshow("");
                    bgetlatlng(e);
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
                    formik.setFieldValue("buyerdeliverydate", e.target.value);
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
              <div className="flex flex-col gap-2">
                <label className="font-semibold">
                  Estimate Delivery Time
                  <span className="text-secondary pb-2">*</span>
                </label>
                <input
                  type="time"
                  name="buyerdeliverytime"
                  onChange={(e) => {
                    e.target.classList.add("change_color");
                    formik.setFieldValue("buyerdeliverytime", e.target.value);
                  }}
                  onBlur={formik.handleBlur}
                  className={
                    formik.touched.buyerdeliverytime &&
                    formik.errors.buyerdeliverytime
                      ? "input-primary ring-2 ring-secondary border-none experience"
                      : "input-primary experience"
                  }
                />
                {formik.touched.buyerdeliverytime &&
                formik.errors.buyerdeliverytime ? (
                  <FormikErrorMessage>
                    {formik.errors.buyerdeliverytime}
                  </FormikErrorMessage>
                ) : null}
              </div>
            </Forms>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={cancelbutton}>
              Cancel
            </Button>
            <Button onClick={formik.handleSubmit} colorScheme="blue">
              Save
            </Button>
            {/* <Button onClick={Submit} colorScheme="blue">
              Save
            </Button> */}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default AddRequirementForBuyer;
