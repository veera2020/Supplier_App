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
import { DatePicker } from "antd";

//function init
const AddRequirement = ({ setreload, reload }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [errorMessage, seterrorMessage] = useState("");
  const [username, setusername] = useState("");
  const [slat, setslat] = useState("");
  const [slng, setslng] = useState("");
  const [errorshow, seterrorshow] = useState("");
  const [supplierId, setSupplierId] = useState("");
  seterrorshow;
  //useEffect
  useEffect(() => {
    axios
      .get(`/v1/supplier/type/getName/supplier`)
      .then((res) => setusername(res.data));
  }, []);
  //Formik regex
  const Namepattern = /^[a-zA-Z\s.]*$/;
  const addressregex = /^[a-zA-Z0-9\s\,\''\-]*$/;
  //geocode for mapview
  Geocode.setApiKey("AIzaSyDoYhbYhtl9HpilAZSy8F_JHmzvwVDoeHI");
  Geocode.setLanguage("en");
  Geocode.setRegion("es");
  Geocode.setLocationType("ROOFTOP");
  Geocode.enableDebug();

  // Get latitude & longitude from supplier address.
  const sgetlatlng = (e) => {
    Geocode.fromAddress(e.target.value).then(
      (response) => {
        const { lat, lng } = response.results[0].geometry.location;
        setslat(lat);
        setslng(lng);
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
    type: "supplier",
    name: "",
    supplierpname: "",
    stocklocation: "",
    stockposition: "",
    stockavailabilitydate: "",
    stockavailabilitytime: "",
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
      console.log(values);
      const locale = "en";
      var today = new Date();
      const totime = today.toLocaleTimeString(locale, {
        hour: "numeric",
        hour12: false,
        minute: "numeric",
      });
      var dd = String(today.getDate()).padStart(2, "0");
      var mm = String(today.getMonth() + 1).padStart(2, "0");
      var yyyy = today.getFullYear();
      today = dd + "-" + mm + "-" + yyyy;
      // convert time string to number
      var a = values.stockavailabilitytime;
      a = a.replace(/\:/g, "");
      const availableTime = parseInt(a);
      var b = totime;
      b = b.replace(/\:/g, "");
      const time = parseInt(b);
      const data = {
        requirementAddBy: "telecaller",
        userId: supplierId,
        product: values.supplierpname.toLowerCase(),
        stockLocation: values.stocklocation.toLowerCase(),
        stockPosition: values.stockposition.toLowerCase(),
        stockAvailabilityDate: values.stockavailabilitydate,
        stockAvailabilityTime: availableTime,
        packType: values.packtype.toLowerCase(),
        expectedPrice: values.expprice,
        expectedQnty: values.expquantity,
        paymentMode: values.paymentmode.toLowerCase(),
        advance: values.advance,
        date: today,
        time: time,
        lat: slat,
        lang: slng,
        status: "",
        moderateStatus:"",
        moderatedPrice:""
      };
      console.log(data);
      axios
        .post("/v1/requirementCollectionBS/Supplier", data)
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
    seterrorshow("");
    formik.resetForm();
  };
  return (
    <>
      <Button onClick={onOpen} colorScheme="blue">
        Add Supplier Requirement
      </Button>
      <Modal isOpen={isOpen} size="xl" onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Supplier Post Requirement</ModalHeader>
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
              <>
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
                      setSupplierId(e.target.value);
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
                {formik.touched.supplierpname && formik.errors.supplierpname ? (
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
                    autoComplete="off"
                    name="stocklocation"
                    placeholder="Enter Stock Location"
                    value={formik.values.stocklocation || ""}
                    onChange={(e) => {
                      formik.handleChange(e);
                      seterrorshow("");
                      sgetlatlng(e);
                    }}
                    onBlur={formik.handleBlur}
                    className={
                      formik.touched.stocklocation &&
                      formik.errors.stocklocation
                        ? "input-primary ring-2 ring-secondary border-none"
                        : "input-primary"
                    }
                  />
                </div>
                {formik.touched.stocklocation && formik.errors.stocklocation ? (
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
                {formik.touched.stockposition && formik.errors.stockposition ? (
                  <FormikErrorMessage>
                    {formik.errors.stockposition}
                  </FormikErrorMessage>
                ) : null}
                {formik.values.stockposition === "To be Ploughed" ? (
                  <>
                    <div className="flex flex-col gap-2">
                      <label className="font-semibold">
                        Stock Availability Date
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
                        Stock Availability Time
                        <span className="text-secondary pb-2">*</span>
                      </label>
                      <input
                        type="time"
                        name="stockavailabilitytime"
                        onChange={(e) => {
                          e.target.classList.add("change_color");
                          formik.setFieldValue(
                            "stockavailabilitytime",
                            e.target.value
                          );
                        }}
                        onBlur={formik.handleBlur}
                        className={
                          formik.touched.stockavailabilitytime &&
                          formik.errors.stockavailabilitytime
                            ? "input-primary ring-2 ring-secondary border-none experience"
                            : "input-primary experience"
                        }
                      />
                    </div>
                    {formik.touched.stockavailabilitytime &&
                    formik.errors.stockavailabilitytime ? (
                      <FormikErrorMessage>
                        {formik.errors.stockavailabilitytime}
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
                    {formik.touched.paymentmode && formik.errors.paymentmode ? (
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
                    {formik.touched.expquantity && formik.errors.expquantity ? (
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
                    {formik.touched.paymentmode && formik.errors.paymentmode ? (
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
