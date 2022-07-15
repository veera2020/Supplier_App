/*
 *  Document    : index.js
 *  Author      : uyarchi
 *  Description : Manage Buyer All Requirement
 */
import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/router";
import Head from "next/head";
import { Breadcrumb } from "antd";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  HStack,
  RadioGroup,
  Radio,
  Input,
  Textarea,
  useDisclosure,
  Alert,
  AlertIcon,
  AlertDescription,
} from "@chakra-ui/react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import Geocode, { setLanguage } from "react-geocode";
//components
import InputFields from "../controls/InputFields";
import Forms from "../controls/Forms";
import Pagination from "../controls/Pagination";
import FormikErrorMessage from "../controls/FormikErrorMessage";
import axios from "../../axios";
//useTable
const useTable = () => {
  const [Loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showLimit, setShowLimit] = useState(10);
  const [gridApi, setGridApi] = useState(null);
  const [rowData, setRowData] = useState(null);
  return {
    currentPage,
    showLimit,
    Loading,
    gridApi,
    rowData,
    setCurrentPage,
    setLoading,
    setShowLimit,
    setGridApi,
    setRowData,
  };
};

//function init
const Buyer = () => {
  //router
  const router = useRouter();
  //usestate
  const [name, setName] = useState("null");
  const [status, setStatus] = useState("null");
  const [errorshow, seterrorshow] = useState("");
  const [callbackreason, setCallBackReason] = useState("null");
  const [reload, setreload] = useState(false);
  const [lat, setlat] = useState("");
  const [lng, setlng] = useState("");
  const [slat, setslat] = useState("");
  const [slng, setslng] = useState("");
  const [itemValue, setItemValue] = useState("");
  const [id, setId] = useState("");
  const [total, settotal] = useState("");

  //Formik InitialValue
  const initialvalue = {
    status: "",
    statusAccept: "",
    reasonforcallback: "",
    minrange: itemValue.minrange,
    maxrange: itemValue.maxrange,
    minprice: itemValue.minprice,
    maxprice: itemValue.maxprice,
    deliverylocation: itemValue.deliverylocation,
    aliveFeedback: "",
    deadFeedback: "",
    ModificationFeedback: "",
    callbackfeedback: "",
  };
  //formik validation
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialvalue,
    validationSchema: Yup.object().shape({
      // status: Yup.string(),
      // statusAccept: Yup.string(),
      // reasonforcallback: Yup.string(),
      // dateCallback: Yup.string(),
      // stockposition: Yup.string(),
      // packtype: Yup.string(),
      // expquantity: Yup.number(),
      // expprice: Yup.number(),
      // deliverylocation: Yup.string(),
      // stockavailabilitydate: Yup.string(),
      // paymentmode: Yup.string(),
      // advance: Yup.string().required("Enter Advance"),
      // aliveFeedback: Yup.string(),
      // deadFeedback: Yup.string(),
      // ModificationFeedback: Yup.string(),
      // callbackfeedback: Yup.string(),
    }),
  });
  //table
  const EmployeeTable = useTable();
  //get employees
  // const [id, setId] = useState("");
  const fetchdata = async (page = 1) => {
    EmployeeTable.setLoading(true);
    const response = await axios.get("/v1/requirementCollectionBS/Buyer");
    if (response.status === 200 && response.data) {
      EmployeeTable.setRowData(response.data);
      settotal(response.data.count);
    } else {
      EmployeeTable.setRowData([]);
    }
  };
  //useEffect
  useEffect(() => {
    fetchdata(EmployeeTable.currentPage, EmployeeTable.showLimit);
  }, [reload, EmployeeTable.currentPage, EmployeeTable.showLimit]);
  //geocode for mapview
  Geocode.setApiKey("AIzaSyDoYhbYhtl9HpilAZSy8F_JHmzvwVDoeHI");
  Geocode.setLanguage("en");
  Geocode.setRegion("es");
  Geocode.setLocationType("ROOFTOP");
  Geocode.enableDebug();
  // Get latitude & longitude from supplier address.
  const getlatlng = (e) => {
    Geocode.fromAddress(e.target.value).then(
      (response) => {
        const { lat, lng } = response.results[0].geometry.location;
        setlat(lat);
        setlng(lng);
        console.log(lat, lng);
      },
      (error) => {
        console.error(error);
        seterrorshow("Enter Vaild Address");
      }
    );
  };
  //modal for map
  const { isOpen, onOpen, onClose } = useDisclosure();
  //mapview
  const isOpenmap = (props) => {
    console.log(props);
    onOpen();
    setslat(props.lat);
    setslng(props.lang);
  };
  const mapStyles = {
    height: "100%",
    width: "100%",
  };
  //modal for order details
  //usestate
  const [isSupplierCallStatus, setIsSupplierCallStatus] = useState(false);
  const isSupplierCallStatusClose = () => {
    setIsSupplierCallStatus(false);
  };
  const SupplierCallStatus = (props) => {
    setIsSupplierCallStatus(true);
    axios
      .get(`/v1/requirementCollectionBS/Buyer/${props}`)
      .then((res) => setItemValue(res.data[0]));
  };
  const UpdatedSupplierCallStatus = () => {
    let values = formik.values;
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
    // var a = values.stockavailabilitytime;
    // a = a.replace(/\:/g, "");
    //const availableTime = parseInt(a);
    var b = totime;
    b = b.replace(/\:/g, "");
    const time = parseInt(b);
    const data = {
      status: values.status,
      statusAccept: values.statusAccept,
      reasonCallback: values.reasonforcallback,
      dateCallback: values.dateCallback,
      aliveFeedback: values.aliveFeedback,
      deadFeedback: values.deadFeedback,
      modificationFeedback: values.ModificationFeedback,
      feedbackCallback: values.callbackfeedback,
      minrange: values.minrange,
      maxrange: values.maxrange,
      minprice: values.minprice,
      maxprice: values.maxprice,
      deliverylocation: values.deliverylocation,
      lat: lat,
      lang: lng,
      date: today,
      time: time,
    };
    console.log(data);
    axios
      .put(`/v1/requirementCollectionBS/Buyer/${id}`, data)
      .then((res) => {
        console.log(res.data);
        setreload(!reload);
        setIsSupplierCallStatus(false);
        formik.resetForm();
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          seterrorMessage(error.response.data.message);
        }
      });
    console.log(data);
  };
  //usestate
  const [isBuyerDetails, setBuyerDetails] = useState(false);
  const [BuyerData, setBuyerData] = useState("");
  const isBuyerDetailsClose = () => {
    setBuyerDetails(false);
  };
  const Buyer = (props) => {
    setBuyerDetails(true);
    axios
      .get(`/v1/requirementCollectionBS/Buyer/${props}`)
      .then((res) => setBuyerData(res.data[0]));
  };
  //usestate
  const [islastTimeUpdatedQtyRange, setLastTimeUpdatedQtyRange] =
    useState(false);
  const [UpdatedDetails, setUpdatedDetails] = useState([]);
  let UpdateQty = [];
  let UpdatePrice = [];
  let UpdateLocation = [];
  UpdatedDetails.map((item) =>
    item.QtyMin && item.QtyMax ? UpdateQty.push(item) : null
  );
  UpdatedDetails.map((item) =>
    item.priceMin && item.priceMax ? UpdatePrice.push(item) : null
  );
  UpdatedDetails.map((item) =>
    item.deliveryLocation ? UpdateLocation.push(item) : null
  );
  const isLastTimeUpdatedQtyRangeClose = () => {
    setLastTimeUpdatedQtyRange(false);
  };
  const UpdatedQtyRangeList = (props) => {
    setLastTimeUpdatedQtyRange(true);
    axios
      .get(`/v1/requirementCollectionBS/Buyer/UpdataData/${props}`)
      .then((res) => setUpdatedDetails(res.data));
  };
  //usestate
  const [islastTimeUpdatedPriceRange, setLastTimeUpdatedPriceRange] =
    useState(false);
  //const [UpdatedDetails, setUpdatedDetails] = useState("");
  const isLastTimeUpdatedPriceRangeClose = () => {
    setLastTimeUpdatedPriceRange(false);
  };
  const UpdatedPriceRangeList = (props) => {
    setLastTimeUpdatedPriceRange(true);
    axios
      .get(`/v1/requirementCollectionBS/Buyer/UpdataData/${props}`)
      .then((res) => setUpdatedDetails(res.data));
  };
  //usestate
  const [islastTimeUpdatedLocation, setLastTimeUpdatedLocation] =
    useState(false);
  //const [UpdatedDetails, setUpdatedDetails] = useState("");
  const isLastTimeUpdatedLocationClose = () => {
    setLastTimeUpdatedLocation(false);
  };
  const UpdatedLocationList = (props) => {
    setLastTimeUpdatedLocation(true);
    axios
      .get(`/v1/requirementCollectionBS/Buyer/UpdataData/${props}`)
      .then((res) => setUpdatedDetails(res.data));
  };
  const Time = (props) => {
    const a = props.data;
    console.log(a);
    const first2Str = String(a).slice(0, 2); // 👉️ '13'
    const second2Str = String(a).slice(2, 4); // 👉️ '13'
    const first2Num = Number(first2Str);
    const second2Num = Number(second2Str);
    const final = first2Num + ":" + second2Num;
    return <>{final}</>;
  };
  return (
    <>
      <Head>
        <title>Supplier/Buyer App - Manage Buyer Requirement</title>
        <meta name="description" content="Generated by create next app" />
      </Head>
      <div className="p-4 ">
        <div className="w-full pb-4">
          <Breadcrumb separator=">">
            <Breadcrumb.Item href="/home">Home</Breadcrumb.Item>
            <Breadcrumb.Item>Manage Buyer Requirement</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr className="p-1"></hr>
        <div className="flex items-center pb-4">
          <span className="flex-auto text-sky-500 text-xl">
            Manage Buyer Requirement
          </span>
          <div className="flex items-center gap-3">
            <Button colorScheme="blue" onClick={() => router.back()}>
              Back
            </Button>
            <Button colorScheme="blue" onClick={() => router.reload()}>
              Refresh
            </Button>
          </div>
        </div>
        <div className="border-gray-500 scroll-smooth border ">
          <Table
            size="sm"
            scaleY="44"
            variant="striped"
            colorScheme="whatsapp"
            className="overflow-auto"
          >
            <Thead className="bg-headergreen ">
              <Tr>
                <Th textAlign="center">S.No</Th>
                <Th textAlign="center">Date / Time</Th>
                <Th textAlign="center">Registered By Whom</Th>
                <Th textAlign="center">Requirement Id</Th>
                <Th textAlign="center">name</Th>
                <Th textAlign="center">Product</Th>
                <Th textAlign="center">Qty Range</Th>
                <Th textAlign="center">Price range</Th>
                <Th textAlign="center">map View</Th>
                <Th textAlign="center">Delivery location</Th>
                <Th textAlign="center">Delivery Date / time</Th>
                <Th textAlign="center">Status</Th>
                <Th textAlign="center">Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {EmployeeTable.rowData != "" ? null : (
                <Tr>
                  <Td
                    style={{ textAlign: "center" }}
                    className="font-semibold"
                    colSpan="13"
                  >
                    No Data Found
                  </Td>
                </Tr>
              )}
              {EmployeeTable.rowData &&
                EmployeeTable.rowData.map((item, index) => (
                  <Tr colSpan="2" key={index}>
                    <Td textAlign="center">{index + 1}</Td>
                    <Td textAlign="center" className="w-32">
                      {item.date} / {<Time data={item.time} />}
                    </Td>
                    <Td textAlign="center">{item.requirementAddBy}</Td>
                    <Td textAlign="center">{item.secretName}</Td>
                    <Td textAlign="center">
                      <Button
                        size="md"
                        colorScheme="blue"
                        variant="link"
                        onClick={() => {
                          Buyer(item._id);
                        }}
                      >
                        {item.name}
                      </Button>
                    </Td>
                    <Td textAlign="center">{item.product}</Td>
                    <Td textAlign="center">
                      <Button
                        size="md"
                        colorScheme="blue"
                        variant="link"
                        onClick={() => {
                          UpdatedQtyRangeList(item._id);
                        }}
                      >
                        {item.minrange}
                        {"-"}
                        {item.maxrange}
                      </Button>
                    </Td>
                    <Td textAlign="center">
                      <Button
                        size="md"
                        colorScheme="blue"
                        variant="link"
                        onClick={() => {
                          UpdatedPriceRangeList(item._id);
                        }}
                      >
                        {item.minprice}
                        {"-"}
                        {item.maxprice}
                      </Button>
                    </Td>
                    <Td textAlign="center">
                      <Button
                        size="sm"
                        colorScheme="blue"
                        variant="link"
                        onClick={() => isOpenmap(item)}
                      >
                        MapView
                      </Button>
                    </Td>
                    <Td textAlign="center">
                      <Button
                        size="md"
                        colorScheme="blue"
                        variant="link"
                        onClick={() => {
                          UpdatedLocationList(item._id);
                          // isOpenmap(item);
                        }}
                      >
                        {item.deliverylocation}
                      </Button>
                    </Td>
                    <Td textAlign="center" className="w-32">
                      {item.deliveryDate}
                      {" / "}
                      {<Time data={item.deliveryTime} />}
                    </Td>
                    <Td textAlign="center">
                      {item.status === "" ? (
                        <div>Pending</div>
                      ) : (
                        <div>{item.status}</div>
                      )}
                    </Td>
                    <Td textAlign="center">
                      <Button
                        size="md"
                        colorScheme="blue"
                        variant="link"
                        onClick={() => {
                          SupplierCallStatus(item._id);
                          // setItemValue(item);
                          setId(item._id);
                        }}
                      >
                        call
                      </Button>
                    </Td>
                  </Tr>
                ))}
            </Tbody>
          </Table>
        </div>
        <Pagination
          totalRecord={total ? total : 0}
          rowLength={EmployeeTable.rowData ? total : 0}
          {...EmployeeTable}
        />
        <Modal
          isOpen={islastTimeUpdatedQtyRange}
          onClose={isLastTimeUpdatedQtyRangeClose}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Updated Quentity Range List</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <div className="border-gray-500 scroll-smooth border">
                <Table
                  size="sm"
                  scaleY="44"
                  variant="striped"
                  colorScheme="whatsapp"
                  className="overflow-auto"
                >
                  <Thead className="bg-headergreen text-center">
                    <Tr>
                      <Th textAlign="center">S.No</Th>
                      <Th textAlign="center">Date</Th>
                      <Th textAlign="center">Time</Th>
                      <Th textAlign="center">Changed Qty Range</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {UpdateQty != "" ? null : (
                      <Tr>
                        <Td
                          style={{ textAlign: "center" }}
                          className="font-semibold"
                          colSpan="4"
                        >
                          No Data Found
                        </Td>
                      </Tr>
                    )}
                    {UpdateQty &&
                      UpdateQty.map((item, index) => (
                        <Tr colSpan="2" key={index}>
                          <Td textAlign="center">{index + 1}</Td>
                          <Td textAlign="center" className="w-32">
                            {item.date}
                          </Td>
                          <Td textAlign="center">
                            <Time data={item.time} />
                          </Td>
                          <Td textAlign="center">
                            {item.QtyMin}
                            {" - "}
                            {item.QtyMax}
                          </Td>
                        </Tr>
                      ))}
                  </Tbody>
                </Table>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                onClick={isLastTimeUpdatedQtyRangeClose}
                colorScheme="blue"
                mr={3}
              >
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Modal
          isOpen={islastTimeUpdatedPriceRange}
          onClose={isLastTimeUpdatedPriceRangeClose}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Updated Price Range</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <div className="border-gray-500 scroll-smooth border">
                <Table
                  size="sm"
                  scaleY="44"
                  variant="striped"
                  colorScheme="whatsapp"
                  className="overflow-auto"
                >
                  <Thead className="bg-headergreen text-center">
                    <Tr>
                      <Th textAlign="center">S.No</Th>
                      <Th textAlign="center">Date</Th>
                      <Th textAlign="center">Time</Th>
                      <Th textAlign="center">Changed Price</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {UpdatePrice != "" ? null : (
                      <Tr>
                        <Td
                          style={{ textAlign: "center" }}
                          className="font-semibold"
                          colSpan="4"
                        >
                          No Data Found
                        </Td>
                      </Tr>
                    )}
                    {UpdatePrice &&
                      UpdatePrice.map((item, index) => (
                        <Tr colSpan="2" key={index}>
                          <Td textAlign="center">{index + 1}</Td>
                          <Td textAlign="center">{item.date}</Td>
                          <Td textAlign="center">
                            <Time data={item.time} />
                          </Td>
                          <Td textAlign="center">
                            {item.priceMin}
                            {" - "}
                            {item.priceMax}
                          </Td>
                        </Tr>
                      ))}
                  </Tbody>
                </Table>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                onClick={isLastTimeUpdatedPriceRangeClose}
                colorScheme="blue"
                mr={3}
              >
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Modal
          isOpen={islastTimeUpdatedLocation}
          onClose={isLastTimeUpdatedLocationClose}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Updated Location List</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <div className="border-gray-500 scroll-smooth border">
                <Table
                  size="sm"
                  scaleY="44"
                  variant="striped"
                  colorScheme="whatsapp"
                  className="overflow-auto"
                >
                  <Thead className="bg-headergreen text-center">
                    <Tr>
                      <Th textAlign="center">S.No</Th>
                      <Th textAlign="center">Date</Th>
                      <Th textAlign="center">Time</Th>
                      <Th textAlign="center">Location</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {UpdateLocation != "" ? null : (
                      <Tr>
                        <Td
                          style={{ textAlign: "center" }}
                          className="font-semibold"
                          colSpan="4"
                        >
                          No Data Found
                        </Td>
                      </Tr>
                    )}
                    {UpdateLocation &&
                      UpdateLocation.map((item, index) => (
                        <Tr colSpan="2" key={index}>
                          <Td textAlign="center">{index + 1}</Td>
                          <Td textAlign="center">{item.date}</Td>
                          <Td textAlign="center">
                            <Time data={item.time} />
                          </Td>
                          <Td textAlign="center">{item.deliveryLocation}</Td>
                        </Tr>
                      ))}
                  </Tbody>
                </Table>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                onClick={isLastTimeUpdatedLocationClose}
                colorScheme="blue"
                mr={3}
              >
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Modal
          // onSubmit={formik.handleSubmit}
          isOpen={isSupplierCallStatus}
          onClose={isSupplierCallStatusClose}
          size="xl"
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              {errorshow && (
                <div className="pb-5">
                  <Alert status="error">
                    <AlertIcon />
                    <AlertDescription>{errorshow}</AlertDescription>
                  </Alert>
                </div>
              )}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Forms>
                <div className="grid items-center gap-2">
                  {/* <div className="flex gap-2"> */}
                  <div className="grid pb-2 gap-2">
                    <label className="font-semibold">Status :</label>
                    <select
                      name="status"
                      value={formik.values.status}
                      onChange={(e) => {
                        formik.setFieldValue("status", e.target.value);
                        formik.setFieldValue("statusAccept", null);
                        e.target.classList.add("change_color");
                      }}
                      onBlur={formik.handleBlur}
                      style={{ outline: 0 }}
                      className="input-primary"
                    >
                      <option value="null">Select Status</option>
                      <option value="Accepted">Accepted</option>
                      <option value="CallBack">CallBack</option>
                    </select>
                  </div>
                  {/* </div> */}
                </div>

                {formik.values.status == "Accepted" ? (
                  <>
                    <div className="grid items-center gap-3 pb-4">
                      <div className="flex-auto font-semibold text-primary"></div>
                      <div className="flex items-center gap-2">
                        <RadioGroup defaultValue="null">
                          <HStack
                            spacing="24px"
                            name="statusAccept"
                            //value={formik.values.statustype || ""}
                            onChange={(e) => {
                              formik.setFieldValue(
                                "statusAccept",
                                e.target.value
                              );

                              setStatus(e.target.value);
                              e.target.classList.add("change_color");
                            }}
                            onBlur={formik.handleBlur}
                          >
                            <div className="grid flex-auto md:w-1/2">
                              <Radio
                                name="statusAccept"
                                value="Requirement Alive"
                              >
                                Requirement Alive.
                              </Radio>
                              <Radio
                                name="statusAccept"
                                value="Requirement dead"
                              >
                                Requirement dead.
                              </Radio>
                              <Radio
                                name="statusAccept"
                                value="Requirement Alive with modification"
                              >
                                Requirement Alive with modification.
                              </Radio>
                            </div>
                          </HStack>
                        </RadioGroup>
                      </div>
                    </div>
                  </>
                ) : null}
                {formik.values.status == "CallBack" ? (
                  <>
                    <div className="grid items-center gap-3 pb-4">
                      <div className="flex-auto font-semibold text-primary"></div>
                      <div className="flex items-center gap-2">
                        <RadioGroup defaultValue="null">
                          <HStack
                            name="reasonforcallback"
                            onChange={(e) => {
                              formik.setFieldValue(
                                "reasonforcallback",
                                e.target.value
                              );
                              setCallBackReason(e.target.value);
                              e.target.classList.add("change_color");
                            }}
                            spacing="24px"
                            //value={formik.values.statustype || ""}
                            onBlur={formik.handleBlur}
                          >
                            <div className="grid flex-auto md:w-1/2">
                              <Radio
                                name="reasonforcallback"
                                value="Second call"
                              >
                                Second call
                              </Radio>
                              <Radio name="reasonforcallback" value="Engaged">
                                Engaged
                              </Radio>
                              <Radio
                                name="reasonforcallback"
                                value="Not reachable"
                              >
                                Not reachable
                              </Radio>
                              <Radio
                                name="reasonforcallback"
                                value="Cutting the call"
                              >
                                Cutting the call
                              </Radio>
                              <Radio name="reasonforcallback" value="Ringing">
                                Ringing
                              </Radio>
                              <Radio
                                name="reasonforcallback"
                                value="Answer to call later"
                              >
                                Answer to call later
                              </Radio>
                            </div>
                          </HStack>
                        </RadioGroup>
                      </div>
                      <div className="flex items-center gap-2">
                        {formik.values.reasonforcallback ===
                        "Answer to call later" ? (
                          <>
                            <Input
                              type="datetime-local"
                              name="dateCallback"
                              placeholder="Enter Price"
                              value={formik.values.dateCallback || ""}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              className={
                                formik.touched.dateCallback &&
                                formik.errors.dateCallback
                                  ? "input-primary bg-whitecolor focus-outline-none ring-2 ring-secondary border-none experience"
                                  : "input-primary bg-whitecolor focus-outline-none experience"
                              }
                            />
                          </>
                        ) : null}
                      </div>
                      <label className="font-semibold">(FeedBack)</label>
                      <Textarea
                        type="string"
                        name="callbackfeedback"
                        placeholder="Feedback :"
                        value={formik.values.callbackfeedback || ""}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={
                          formik.touched.callbackfeedback &&
                          formik.errors.callbackfeedback
                            ? "input-primary bg-whitecolor focus-outline-none ring-2 ring-secondary border-none experience"
                            : "input-primary bg-whitecolor focus-outline-none experience"
                        }
                      />
                    </div>
                  </>
                ) : null}
                <div className="grid items-center gap-3 pb-2">
                  {/* <div className="flex-auto font-semibold text-primary"></div> */}
                  <div className="items-center gap-2">
                    {/* {statusfb == "Requirement Alive" ? <></> : ""} */}
                    {formik.values.statusAccept == "Requirement Alive" ? (
                      <>
                        <label className="font-semibold">
                          (No Change Done)
                        </label>
                        <Textarea
                          type="string"
                          name="aliveFeedback"
                          placeholder="Feedback :"
                          value={formik.values.aliveFeedback || ""}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className={
                            formik.touched.aliveFeedback &&
                            formik.errors.aliveFeedback
                              ? "input-primary bg-whitecolor focus-outline-none ring-2 ring-secondary border-none experience"
                              : "input-primary bg-whitecolor focus-outline-none experience"
                          }
                        />
                      </>
                    ) : null}
                    {formik.values.statusAccept == "Requirement dead" ? (
                      <>
                        <label className="font-semibold ">(Reject)</label>
                        <Textarea
                          type="string"
                          name="deadFeedback"
                          placeholder="Feedback :"
                          value={formik.values.deadFeedback || ""}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className={
                            formik.touched.deadFeedback &&
                            formik.errors.deadFeedback
                              ? "input-primary bg-whitecolor focus-outline-none ring-2 ring-secondary border-none experience"
                              : "input-primary bg-whitecolor focus-outline-none experience"
                          }
                        />
                      </>
                    ) : null}
                  </div>
                </div>
                <div className="grid items-center gap-3 pb-2">
                  <div className="items-center gap-2">
                    {formik.values.statusAccept ==
                    "Requirement Alive with modification" ? (
                      <div>
                        <div className="flex flex-col gap-2">
                          <label className="font-semibold">
                            Quantity Range
                          </label>
                          <div className="flex gap-5">
                            <InputFields
                              type="number"
                              name="minrange"
                              value={formik.values.minrange || ""}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              className={
                                formik.values.minrange > formik.values.maxrange
                                  ? "input-primary bg-whitecolor focus-outline-none ring-2 ring-secondary border-none experience"
                                  : "input-primary "
                              }
                            />
                            <InputFields
                              type="number"
                              name="maxrange"
                              value={formik.values.maxrange || ""}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              className={
                                formik.values.minrange > formik.values.maxrange
                                  ? "input-primary bg-whitecolor focus-outline-none ring-2 ring-secondary border-none experience"
                                  : "input-primary "
                              }
                            />
                          </div>
                          {formik.values.minrange > formik.values.maxrange ? (
                            <FormikErrorMessage>
                              {"Plz Check quentity Range"}
                            </FormikErrorMessage>
                          ) : null}
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="font-semibold">Landing Price</label>
                          <div className="flex gap-5">
                            <InputFields
                              type="number"
                              name="minprice"
                              value={formik.values.minprice || ""}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              className={
                                formik.values.minprice > formik.values.maxprice
                                  ? "input-primary bg-whitecolor focus-outline-none ring-2 ring-secondary border-none experience"
                                  : "input-primary "
                              }
                            />
                            <InputFields
                              type="number"
                              name="maxprice"
                              value={formik.values.maxprice || ""}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              className={
                                formik.values.minprice > formik.values.maxprice
                                  ? "input-primary bg-whitecolor focus-outline-none ring-2 ring-secondary border-none experience"
                                  : "input-primary "
                              }
                            />
                          </div>
                          {formik.values.minprice > formik.values.maxprice ||
                          formik.values.minprice > formik.values.maxprice ? (
                            <FormikErrorMessage>
                              {"Pleace Check Price List"}
                            </FormikErrorMessage>
                          ) : null}
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="font-semibold">
                            Delivery Location
                            {/* <span className="text-secondary pb-2">*</span> */}
                          </label>
                          <InputFields
                            type="string"
                            name="deliverylocation"
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
                        {/* <div className="flex flex-col gap-2">
                          <label className="font-semibold">
                            Estimate Delivery Date
                            <span className="text-secondary pb-2">*</span>
                          </label>
                          <input
                            type="date"
                            name="buyerdeliverydate"
                            value={formik.values.buyerdeliverydate}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={
                              formik.touched.buyerdeliverydate &&
                              formik.errors.buyerdeliverydate
                                ? "input-primary ring-2 ring-secondary border-none"
                                : "input-primary"
                            }
                          />
                          {formik.touched.buyerdeliverydate &&
                          formik.errors.buyerdeliverydate ? (
                            <FormikErrorMessage>
                              {formik.errors.buyerdeliverydate}
                            </FormikErrorMessage>
                          ) : null}
                        </div> */}
                        <div className="grid pb-2 gap-2">
                          <label className="font-semibold ">(Feedback)</label>
                          <Textarea
                            type="string"
                            name="ModificationFeedback"
                            placeholder="Feedback :"
                            value={formik.values.ModificationFeedback || ""}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={
                              formik.touched.ModificationFeedback &&
                              formik.errors.ModificationFeedback
                                ? "input-primary bg-whitecolor focus-outline-none ring-2 ring-secondary border-none experience"
                                : "input-primary bg-whitecolor focus-outline-none experience"
                            }
                          />
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </Forms>
            </ModalBody>
            <ModalFooter>
              {formik.values.aliveFeedback != "" ||
              formik.values.deadFeedback != "" ||
              formik.values.ModificationFeedback != "" ||
              formik.values.callbackfeedback != "" ? (
                <Button onClick={UpdatedSupplierCallStatus} colorScheme="blue">
                  Save
                </Button>
              ) : (
                <Button
                  //onClick={UpdatedSupplierCallStatus}
                  colorScheme="blue"
                  disabled
                >
                  Save
                </Button>
              )}
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Modal isOpen={isBuyerDetails} onClose={isBuyerDetailsClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Buyer Details</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <div className="p-4 ">
                <>
                  <div className="border border-graycolor cursor-pointer">
                    <div className="grid grid-cols-6 px-4 px-1">
                      <div className="col-span-2 text-blue-500 text-semibold border-r border-b border-graycolor p-1">
                        Product Name
                      </div>
                      <div className="col-span-4 border-b p-1">
                        {BuyerData.product}
                      </div>
                      <div className="col-span-2 text-blue-500 text-semibold border-r border-b border-graycolor p-1">
                        Quality Range
                      </div>
                      <div className="col-span-2 border-b border-r p-1">
                        {BuyerData.minrange}
                      </div>
                      <div className="col-span-2 border-b p-1">
                        {BuyerData.maxrange}
                      </div>
                      <div className="col-span-2 text-blue-500 text-semibold border-r border-b border-graycolor p-1">
                        Landing Price
                      </div>
                      <div className="col-span-2 border-b border-r p-1">
                        {BuyerData.minprice}
                      </div>
                      <div className="col-span-2 border-b p-1">
                        {BuyerData.maxprice}
                      </div>
                      <div className="col-span-2 text-blue-500 text-semibold border-r border-b border-graycolor p-1">
                        Delivery Location
                      </div>
                      <div className="col-span-4 border-b p-1">
                        {BuyerData.deliverylocation}
                      </div>
                      <div className="col-span-2 text-blue-500 text-semibold border-r border-b border-graycolor p-1">
                        Estimate Delivery Date
                      </div>
                      <div className="col-span-4 border-b p-1">
                        {BuyerData.deliveryDate}
                      </div>
                      <div className="col-span-2 text-blue-500 text-semibold border-r border-b border-graycolor p-1">
                        Estimate Delivery Time
                      </div>
                      <div className="col-span-4 border-b p-1">
                        {BuyerData.deliveryTime}
                      </div>
                      {BuyerData.status ? (
                        <>
                          <div className="col-span-2 text-blue-500 text-semibold border-r border-b border-graycolor p-1">
                            Status
                          </div>
                          <div className="col-span-4 border-b p-1">
                            {BuyerData.status}
                          </div>
                          {BuyerData.status == "Accepted" ? (
                            <>
                              <div className="col-span-2 text-blue-500 text-semibold border-r border-b border-graycolor p-1">
                                Accepted Reason
                              </div>
                              <div className="col-span-4 border-b p-1">
                                {BuyerData.statusAccept}
                              </div>
                              <div className="col-span-2 text-blue-500 text-semibold border-r border-b border-graycolor p-1">
                                FeedBack
                              </div>
                              <div className="col-span-4 border-b p-1">
                                {BuyerData.statusAccept == "Requirement Alive"
                                  ? BuyerData.aliveFeedback == ""
                                    ? "null"
                                    : BuyerData.aliveFeedback
                                  : null}
                                {BuyerData.statusAccept == "Requirement dead"
                                  ? BuyerData.aliveFeedback == ""
                                    ? "null"
                                    : BuyerData.deadFeedback
                                  : null}
                                {BuyerData.statusAccept ==
                                "Requirement Alive with modification"
                                  ? BuyerData.aliveFeedback == ""
                                    ? "null"
                                    : BuyerData.modificationFeedback
                                  : null}
                              </div>
                            </>
                          ) : null}
                          {BuyerData.status == "CallBack" ? (
                            <>
                              <div className="col-span-2 text-blue-500 text-semibold border-r border-b border-graycolor p-1">
                                Callback Reason
                              </div>
                              <div className="col-span-4 border-b p-1">
                                {BuyerData.reasonCallback}
                              </div>
                              {BuyerData.reasonCallback ==
                              "Answer to call later" ? (
                                <>
                                  <div className="col-span-2 text-blue-500 text-semibold border-r border-b border-graycolor p-1">
                                    Back to Call
                                  </div>
                                  <div className="col-span-4 border-b p-1">
                                    {BuyerData.dateCallback.split("T")[0]}
                                  </div>
                                </>
                              ) : null}
                              <div className="col-span-2 text-blue-500 text-semibold border-r border-b border-graycolor p-1">
                                FeedBack
                              </div>
                              <div className="col-span-4 border-b p-1">
                                {BuyerData.feedbackCallback == ""
                                  ? "null"
                                  : BuyerData.feedbackCallback}
                              </div>
                            </>
                          ) : null}
                        </>
                      ) : null}
                    </div>
                  </div>
                </>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button onClick={isBuyerDetailsClose} colorScheme="red" mr={3}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Map View</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <div className="flex justify-center text-center">
                <div className="object-cover h-48 w-96">
                  <LoadScript googleMapsApiKey="AIzaSyDoYhbYhtl9HpilAZSy8F_JHmzvwVDoeHI">
                    <GoogleMap
                      mapContainerStyle={mapStyles}
                      zoom={13}
                      center={{
                        lat: parseFloat(slat),
                        lng: parseFloat(slng),
                      }}
                    >
                      <Marker
                        position={{
                          lat: parseFloat(slat),
                          lng: parseFloat(slng),
                        }}
                      />
                    </GoogleMap>
                  </LoadScript>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button onClick={onClose} colorScheme="blue" mr={3}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </>
  );
};
export default Buyer;
