/*
 *  Document    : Supplier.js
 *  Author      : uyarchi
 *  Description : Manage Supplier and Buyer
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
} from "@chakra-ui/react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
//components
import InputFields from "../controls/InputFields";
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
// Status
const Status = [
  { value: "pending", label: "Pending" },
  { value: "moderated", label: "Moderated" },
  { value: "rejected", label: "Rejected" },
];
const CallStatus = [
  { value: "Accepted", label: "Accepted" },
  { value: "CallBack", label: "CallBack" },
];

//function init
const Supplier = () => {
  //router
  const router = useRouter();
  //usestate
  const [name, setName] = useState("null");
  const [status, setStatus] = useState("null");
  const [statusfb, setStatusFB] = useState("null");
  const [callbackreason, setCallBackReason] = useState("null");
  const [reload, setreload] = useState(false);
  const [lat, setlat] = useState("");
  const [lng, setlng] = useState("");
  const [itemValue, setItemValue] = useState("");

  //Formik regex
  const Namepattern = /^[a-zA-Z\s.]*$/;
  const addressregex = /^[a-zA-Z0-9\s\,\''\-]*$/;
  //Formik InitialValue
  const initialvalue = {
    status: "",
    statustype: "",
    statustypecalldate: "",
    stockposition: itemValue.stockposition,
    packtype: itemValue.packtype,
    expquantity: itemValue.expquantity,
    expprice: itemValue.expprice,
    minrange: itemValue.minrange,
    maxrange: itemValue.maxrange,
    minprice: itemValue.minprice,
    maxprice: itemValue.maxprice,
    pdelivery: itemValue.pdelivery,
    deliverylocation: itemValue.deliverylocation,
    buyerdeliverydate: itemValue.buyerdeliverydate,
    stockavailabilitydate: itemValue.stockavailabilitydate,
    paymentmode: itemValue.paymentmode,
    advance: itemValue.advance,
    statustypeFB: "",
  };
  //formik validation
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialvalue,
    validationSchema: Yup.object().shape({
      status: Yup.string(),
      statustype: Yup.string(),
      statustypecalldate: Yup.string(),
      stockposition: Yup.string(),
      packtype: Yup.string(),
      expquantity: Yup.number(),
      expprice: Yup.number(),
      minrange: Yup.number(),
      maxrange: Yup.number(),
      minprice: Yup.number(),
      maxprice: Yup.number(),
      pdelivery: Yup.string(),
      deliverylocation: Yup.string(),
      buyerdeliverydate: Yup.string(),
      stockavailabilitydate: Yup.string(),
      paymentmode: Yup.string(),
      advance: Yup.string(),
      statustypeFB: Yup.string(),
    }),
    onSubmit: (values) => {
      console.log(values);
      //date
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, "0");
      var mm = String(today.getMonth() + 1).padStart(2, "0");
      var yyyy = today.getFullYear();
      today = dd + "-" + mm + "-" + yyyy;
      const data = {
        // type: values.type,
        // name: values.name,
        // buyerpname: values.buyerpname,
        // minrange: values.minrange,
        // maxrange: values.maxrange,
        // minprice: values.minprice,
        // maxprice: values.maxprice,
        // pdelivery: values.pdelivery,
        // deliverylocation: values.deliverylocation,
        // buyerdeliverydate: values.buyerdeliverydate,
        // supplierpname: values.supplierpname,
        // stocklocation: values.stocklocation,
        // stockposition: values.stockposition,
        // stockavailabilitydate: values.stockavailabilitydate,
        // packtype: values.packtype,
        // expprice: values.expprice,
        // expquantity: values.expquantity,
        // paymentmode: values.paymentmode,
        // advance: values.advance,
        // date: today,
        // latitude: lat,
        // longitude: lng,
      };
      // axios
      //   .post("/v1/postorder", data)
      //   .then((res) => {
      //     console.log(res.data);
      //     setreload(!reload);
      //     onClose();
      //     formik.resetForm();
      //   })
      //   .catch((error) => {
      //     if (error.response) {
      //       console.log(error.response);
      //       seterrorMessage(error.response.data.message);
      //     }
      //   });
    },
  });

  //table
  const EmployeeTable = useTable();
  //get employees
  const [id, setId] = useState("");
  const fetchdata = async (page = 1) => {
    EmployeeTable.setLoading(true);
    const response = await axios.get("/v1/postorder");
    if (response.status === 200 && response.data) {
      EmployeeTable.setRowData(response.data);
    } else {
      EmployeeTable.setRowData([]);
    }
  };
  //useEffect
  useEffect(() => {
    fetchdata(EmployeeTable.currentPage, EmployeeTable.showLimit);
  }, [reload, EmployeeTable.currentPage, EmployeeTable.showLimit]);
  //modal for map
  const { isOpen, onOpen, onClose } = useDisclosure();
  //mapview
  const isOpenmap = (props) => {
    onOpen();
    // setlat(props.mlatitude);
    // setlng(props.mlongitude);
    setlat(13.033643);
    setlng(80.250518);
  };
  const mapStyles = {
    height: "100%",
    width: "100%",
  };
  //modal for order details
  //usestate
  const [isStatusCall, setIsStatusCall] = useState(false);
  //const [shop, setshop] = useState("");
  const isStatusCallClose = () => {
    setIsStatusCall(false);
  };
  const statusCall = () => {
    setIsStatusCall(true);
    //axios.get(`/v1/supplierBuyer/${props}`).then((res) => setshop(res.data));
  };
  //usestate
  const [isUserDetails, setIsUserDetails] = useState(false);
  const [details, setDetails] = useState("");
  const isUserDetailsClose = () => {
    setIsUserDetails(false);
  };
  const userDetail = (props) => {
    setIsUserDetails(true);
    axios.get(`/v1/postorder/${props}`).then((res) => setDetails(res.data));
  };

  return (
    <>
      <Head>
        <title>Supplier/Buyer App - Manage Customers</title>
        <meta name="description" content="Generated by create next app" />
      </Head>
      <div className="p-4 ">
        <div className="w-full pb-4">
          <Breadcrumb separator=">">
            <Breadcrumb.Item href="/home">Home</Breadcrumb.Item>
            <Breadcrumb.Item>Manege Customers</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr className="p-1"></hr>
        <div className="flex items-center pb-4">
          <span className="flex-auto text-sky-500 text-xl">
            Manage Customers
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
        <div className="border-gray-500 scroll-smooth border">
          <Table
            size="sm"
            scaleY="44"
            variant="striped"
            colorScheme="whatsapp"
            className="overflow-auto"
          >
            <Thead className="bg-headergreen">
              <Tr>
                <Th>S.No</Th>
                <Th>Date</Th>
                <Th>Type</Th>
                <Th>name</Th>
                <Th>Product</Th>
                <Th>map View</Th>
                <Th>Status</Th>
                <Th>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {EmployeeTable.rowData != "" ? null : (
                <Tr className="flex justify-center text-center px-2 ">
                  No Data Found
                </Tr>
              )}
              {EmployeeTable.rowData &&
                EmployeeTable.rowData.map((item, index) => (
                  <Tr colSpan="2" key={index}>
                    <Td>{index + 1}</Td>
                    <Td>{item.date}</Td>
                    <Td>{item.type}</Td>
                    <Td>
                      <Button
                        size="md"
                        colorScheme="blue"
                        variant="link"
                        onClick={() => {
                          userDetail(item.id);
                          //setName("sup");
                        }}
                      >
                        {item.name}
                      </Button>
                    </Td>
                    <Td>{item.supplierpname || item.buyerpname}</Td>
                    <Td>
                      <Button
                        size="sm"
                        colorScheme="blue"
                        variant="link"
                        onClick={() => isOpenmap(item)}
                      >
                        MapView
                      </Button>
                    </Td>
                    <Td>
                      {item.status ? (
                        <>
                          <Td>{item.status}</Td>
                          <Td>{item.feedback}</Td>
                        </>
                      ) : (
                        <>nill</>
                      )}
                    </Td>
                    <Td>
                      <Button
                        size="md"
                        colorScheme="blue"
                        variant="link"
                        onClick={() => {
                          statusCall();
                          setItemValue(item);
                          //setName("sup");
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
        <Modal isOpen={isStatusCall} onClose={isStatusCallClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>By Telecaller</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <div className="grid items-center gap-2">
                {/* <div className="flex gap-2"> */}
                <div className="grid pb-2 gap-2">
                  <label className="font-semibold">Status :</label>
                  <select
                    name="status"
                    value={formik.values.status}
                    onChange={(e) => {
                      formik.setFieldValue("status", e.target.value);
                      setStatus(e.target.value);
                      e.target.classList.add("change_color");
                    }}
                    onBlur={formik.handleBlur}
                    style={{ outline: 0 }}
                    className="input-primary"
                  >
                    <option value="null">Select Status</option>
                    {CallStatus &&
                      CallStatus.map((item, index) => (
                        <option
                          key={index}
                          value={item.value}
                          selected={item.value === itemValue.status}
                        >
                          {item.label}
                        </option>
                      ))}
                  </select>
                </div>
                {/* </div> */}
              </div>
              <div className="grid items-center gap-3 pb-4">
                <div className="flex-auto font-semibold text-primary"></div>
                <div className="flex items-center gap-2">
                  {formik.values.status == "Accepted" ? (
                    <>
                      <RadioGroup defaultValue="null">
                        <HStack
                          spacing="24px"
                          name="statustype"
                          //value={formik.values.statustype || ""}
                          onChange={(e) => {
                            formik.setFieldValue("statustype", e.target.value);
                            setStatus(e.target.value);
                            e.target.classList.add("change_color");
                          }}
                          onBlur={formik.handleBlur}
                        >
                          <div className="grid flex-auto md:w-1/2">
                            <Radio name="statustype" value="Requirement Alive">
                              Requirement Alive.
                            </Radio>
                            <Radio name="statustype" value="Requirement dead">
                              Requirement dead.
                            </Radio>
                            <Radio
                              name="statustype"
                              value="Requirement Alive with modification"
                            >
                              Requirement Alive with modification.
                            </Radio>
                          </div>
                        </HStack>
                      </RadioGroup>
                    </>
                  ) : (
                    ""
                  )}
                  {formik.values.status == "CallBack" ? (
                    <>
                      <RadioGroup defaultValue="null">
                        <HStack
                          name="statustype"
                          onChange={(e) => {
                            formik.setFieldValue("statustype", e.target.value);
                            setCallBackReason(e.target.value);
                            e.target.classList.add("change_color");
                          }}
                          spacing="24px"
                          //value={formik.values.statustype || ""}
                          onBlur={formik.handleBlur}
                        >
                          <div className="grid flex-auto md:w-1/2">
                            <Radio name="statustype" value="Second call">
                              Second call
                            </Radio>
                            <Radio name="statustype" value="Engaged">
                              Engaged
                            </Radio>
                            <Radio name="statustype" value="Not reachable">
                              Not reachable
                            </Radio>
                            <Radio name="statustype" value="Cutting the call">
                              Cutting the call
                            </Radio>
                            <Radio name="statustype" value="Ringing">
                              Ringing
                            </Radio>
                            <Radio
                              name="statustype"
                              value="Answer to call later"
                            >
                              Answer to call later
                            </Radio>
                          </div>
                        </HStack>
                      </RadioGroup>
                    </>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              <div className="grid items-center gap-3 pb-2">
                {/* <div className="flex-auto font-semibold text-primary"></div> */}
                <div className="flex items-center gap-2">
                  {formik.values.statustype === "Answer to call later" ? (
                    <>
                      <Input
                        type="datetime-local"
                        name="statustypecalldate"
                        placeholder="Enter Price"
                        value={formik.values.statustypecalldate || ""}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={
                          formik.touched.statustypecalldate &&
                          formik.errors.statustypecalldate
                            ? "input-primary bg-whitecolor focus-outline-none ring-2 ring-secondary border-none experience"
                            : "input-primary bg-whitecolor focus-outline-none experience"
                        }
                      />
                    </>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              <div className="grid items-center gap-3 pb-2">
                {/* <div className="flex-auto font-semibold text-primary"></div> */}
                <div className="items-center gap-2">
                  {statusfb == "Requirement Alive" ? <></> : ""}
                  {formik.values.statustype == "Requirement Alive" ? (
                    <>
                      <label className="font-semibold">(No Change Done)</label>
                      <Textarea
                        type="string"
                        name="statustypeFB"
                        placeholder="Feedback :"
                        value={formik.values.statustypeFB || ""}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={
                          formik.touched.statustypeFB &&
                          formik.errors.statustypeFB
                            ? "input-primary bg-whitecolor focus-outline-none ring-2 ring-secondary border-none experience"
                            : "input-primary bg-whitecolor focus-outline-none experience"
                        }
                      />
                    </>
                  ) : (
                    ""
                  )}
                  {formik.values.statustype == "Requirement dead" ? (
                    <>
                      <label className="font-semibold ">(Reject)</label>
                      <Textarea
                        type="string"
                        name="statustypeFB"
                        placeholder="Feedback :"
                        value={formik.values.statustypeFB || ""}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={
                          formik.touched.statustypeFB &&
                          formik.errors.statustypeFB
                            ? "input-primary bg-whitecolor focus-outline-none ring-2 ring-secondary border-none experience"
                            : "input-primary bg-whitecolor focus-outline-none experience"
                        }
                      />
                    </>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              <div className="grid items-center gap-3 pb-2">
                <div className="items-center gap-2">
                  {formik.values.statustype ==
                  "Requirement Alive with modification" ? (
                    <div>
                      {itemValue.type == "" ? <></> : ""}
                      {itemValue.type == "Supplier" ? (
                        <>
                          <div className="grid pb-2 gap-2">
                            <label className="font-semibold">
                              Stock Position :
                            </label>
                            <select
                              name="stockposition"
                              value={formik.values.stockposition}
                              onChange={(e) => {
                                formik.setFieldValue(
                                  "stockposition",
                                  e.target.value
                                );
                                //setStatus(e.target.value);
                                e.target.classList.add("change_color");
                              }}
                              style={{ outline: 0 }}
                              className="input-primary"
                            >
                              <option
                                name="stockposition"
                                value={itemValue.stockposition}
                              >
                                {itemValue.stockposition}
                              </option>
                              <option name="stockposition" value="Ready">
                                Ready
                              </option>
                              <option
                                name="stockposition"
                                value="To be Ploughed"
                              >
                                To be Ploughed
                              </option>
                            </select>
                          </div>
                          {formik.values.stockposition == "Ready" ? (
                            <>
                              <div className="grid pb-2 gap-2">
                                <label className="font-semibold ">
                                  Pack Type
                                </label>
                                <InputFields
                                  type="string"
                                  name="packtype"
                                  value={formik.values.packtype || ""}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  className="input-primary"
                                />
                              </div>
                              <div className="grid pb-2 gap-2">
                                <label className="font-semibold ">
                                  Excepted Quantity
                                </label>
                                <InputFields
                                  type="string"
                                  name="expquantity"
                                  value={formik.values.expquantity || ""}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  className="input-primary"
                                />
                              </div>
                              <div className="grid pb-2 gap-2">
                                <label className="font-semibold ">
                                  Excepted Price
                                </label>
                                <InputFields
                                  type="string"
                                  name="expprice"
                                  value={formik.values.expprice || ""}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  className="input-primary"
                                />
                              </div>
                            </>
                          ) : (
                            ""
                          )}
                          {formik.values.stockposition == "To be Ploughed" ? (
                            <>
                              <div className="grid pb-2 gap-2">
                                <label className="font-semibold ">
                                  Excepted Price
                                </label>
                                <InputFields
                                  type="date"
                                  name="expprice"
                                  value={formik.values.expprice || ""}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  className="input-primary"
                                />
                              </div>
                            </>
                          ) : (
                            ""
                          )}
                          <div className="grid pb-2 gap-2">
                            <label className="font-semibold">
                              Payment Mode :
                            </label>
                            <select
                              name="paymentmode"
                              value={formik.values.paymentmode}
                              onChange={(e) => {
                                formik.setFieldValue(
                                  "paymentmode",
                                  e.target.value
                                );
                                // setStatus(e.target.value);
                                e.target.classList.add("change_color");
                              }}
                              style={{ outline: 0 }}
                              className="input-primary"
                            >
                              <option
                                name="paymentmode"
                                value={itemValue.paymentmode}
                                selected={
                                  itemValue.paymentmode ===
                                  itemValue.paymentmode
                                }
                              >
                                {itemValue.paymentmode}
                              </option>
                              <option name="paymentmode" value="Credit">
                                Credit
                              </option>
                              <option name="paymentmode" value="Advance">
                                Advance
                              </option>
                              <option name="paymentmode" value="COD">
                                COD
                              </option>
                            </select>
                          </div>
                          {formik.values.paymentmode == "Advance" ? (
                            <>
                              <div className="grid pb-2 gap-2">
                                <label className="font-semibold ">
                                  Advance
                                </label>
                                <InputFields
                                  type="string"
                                  name="advance"
                                  value={formik.values.advance || ""}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  className={
                                    formik.touched.advance &&
                                    formik.errors.advance
                                      ? "input-primary ring-2 ring-secondary border-none"
                                      : "input-primary"
                                  }
                                />
                              </div>
                            </>
                          ) : (
                            ""
                          )}
                          <div className="grid pb-2 gap-2">
                            <label className="font-semibold ">(Feedback)</label>
                            <Textarea
                              type="string"
                              name="statustypeFB"
                              placeholder="Feedback :"
                              value={formik.values.statustypeFB || ""}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              className={
                                formik.touched.statustypeFB &&
                                formik.errors.statustypeFB
                                  ? "input-primary bg-whitecolor focus-outline-none ring-2 ring-secondary border-none experience"
                                  : "input-primary bg-whitecolor focus-outline-none experience"
                              }
                            />
                          </div>
                        </>
                      ) : (
                        ""
                      )}
                      {itemValue.type == "Buyer" ? (
                        <>
                          <div className="flex flex-col gap-2">
                            <label className="font-semibold">
                              Quantity Range
                            </label>
                            <div className="flex gap-5">
                              <InputFields
                                type="number"
                                name="minrange"
                                className="input-primary"
                                value={formik.values.minrange || ""}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                              />
                              <InputFields
                                type="number"
                                name="maxrange"
                                className="input-primary"
                                value={formik.values.maxrange || ""}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                              />
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <label className="font-semibold">
                              Landing Price
                            </label>
                            <div className="flex gap-5">
                              <InputFields
                                type="number"
                                name="minprice"
                                className="input-primary"
                                value={formik.values.minprice || ""}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                              />
                              <InputFields
                                type="number"
                                name="maxprice"
                                className="input-primary"
                                value={formik.values.maxprice || ""}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                              />
                            </div>
                          </div>
                          <div className="grid pb-2 gap-2">
                            <label className="font-semibold">
                              Stock (Product Delivery)
                            </label>
                            <RadioGroup>
                              <HStack
                                direction="row"
                                name="pdelivery"
                                value={formik.values.pdelivery || ""}
                                onChange={(e) => {
                                  formik.setFieldValue(
                                    "pdelivery",
                                    e.target.value
                                  );
                                }}
                                onBlur={formik.handleBlur}
                              >
                                <Radio
                                  name="pdelivery"
                                  value="Pickup Directly"
                                  checked={
                                    formik.values.pdelivery == "Pickup Directly"
                                      ? true
                                      : false
                                  }
                                >
                                  Pickup Directly
                                </Radio>
                                <Radio
                                  name="pdelivery"
                                  value="Delivery to Location"
                                  checked={
                                    formik.values.pdelivery ==
                                    "Delivery to Location"
                                      ? true
                                      : false
                                  }
                                >
                                  Delivery to Location
                                </Radio>
                              </HStack>
                            </RadioGroup>
                          </div>
                          {formik.values.pdelivery ===
                          "Delivery to Location" ? (
                            <>
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
                            </>
                          ) : (
                            ""
                          )}
                          <div className="flex flex-col gap-2">
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
                            {/* {formik.touched.buyerdeliverydate &&
                            formik.errors.buyerdeliverydate ? (
                              <FormikErrorMessage>
                                {formik.errors.buyerdeliverydate}
                              </FormikErrorMessage>
                            ) : null} */}
                          </div>
                        </>
                      ) : (
                        ""
                      )}
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button onClick={formik.handleSubmit} colorScheme="blue">
                Save
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Modal isOpen={isUserDetails} onClose={isUserDetailsClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>User Details</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <div className="p-4 ">
                {details.type == "Supplier" ? (
                  <>
                    <div className="border border-graycolor cursor-pointer">
                      <div className="grid grid-cols-6 px-4 p-1">
                        <div className="col-span-2 text-blue-500 text-semibold border-r border-b border-graycolor p-1">
                          Type
                        </div>
                        <div className="col-span-4 border-b p-1">
                          {details.type}
                        </div>
                        <div className="col-span-2 text-blue-500 text-semibold border-r border-b border-graycolor p-1">
                          Name
                        </div>
                        <div className="col-span-4 border-b p-1">
                          {details.name}
                        </div>
                        <div className="col-span-2 text-blue-500 text-semibold border-r border-b border-graycolor p-1">
                          Product Name
                        </div>
                        <div className="col-span-4 border-b p-1">
                          {details.supplierpname}
                        </div>
                        <div className="col-span-2 text-blue-500 text-semibold border-r border-b border-graycolor p-1">
                          Stock Location
                        </div>
                        <div className="col-span-4 border-b p-1">
                          {details.stocklocation}
                        </div>
                        <div className="col-span-2 text-blue-500 text-semibold border-r border-b border-graycolor p-1">
                          Stock position
                        </div>
                        <div className="col-span-4 border-b p-1">
                          {details.stockposition}
                        </div>
                        <div className="col-span-2 text-blue-500 text-semibold border-r border-b border-graycolor p-1">
                          Pack Type
                        </div>
                        <div className="col-span-4 border-b p-1">
                          {details.packtype}
                        </div>
                        <div className="col-span-2 text-blue-500 text-semibold border-r border-b border-graycolor p-1">
                          Excepted Quantity
                        </div>
                        <div className="col-span-4 border-b p-1">
                          {details.expquantity}
                        </div>
                        <div className="col-span-2 text-blue-500 text-semibold border-r border-b border-graycolor p-1">
                          Excepted Price
                        </div>
                        <div className="col-span-4 border-b p-1">
                          {details.expprice}
                        </div>
                        <div className="col-span-2 text-blue-500 text-semibold border-r border-b border-graycolor p-1">
                          Stock Availability
                        </div>
                        <div className="col-span-4 border-b p-1">
                          {details.stockavailabilitydate}
                        </div>
                        <div className="col-span-2 text-blue-500 text-semibold border-r border-graycolor p-1">
                          Payment Mode
                        </div>
                        <div className="col-span-4 p-1">
                          {details.paymentmode}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  ""
                )}
                {details.type == "Buyer" ? (
                  <>
                    <div className="border border-graycolor cursor-pointer">
                      <div className="grid grid-cols-6 px-4 p-1">
                        <div className="col-span-2 text-blue-500 text-semibold border-r border-b border-graycolor p-1">
                          Type
                        </div>
                        <div className="col-span-4 border-b p-1">
                          {details.type}
                        </div>
                        <div className="col-span-2 text-blue-500 text-semibold border-r border-b border-graycolor p-1">
                          Name
                        </div>
                        <div className="col-span-4 border-b p-1">
                          {details.name}
                        </div>
                        <div className="col-span-2 text-blue-500 text-semibold border-r border-b border-graycolor p-1">
                          Product Name
                        </div>
                        <div className="col-span-4 border-b p-1">
                          {details.buyerpname}
                        </div>
                        <div className="col-span-2 text-blue-500 text-semibold border-r border-b border-graycolor p-1">
                          Quality Range
                        </div>
                        <div className="col-span-2 border-b border-r p-1">
                          {details.minrange}
                        </div>
                        <div className="col-span-2 border-b p-1">
                          {details.maxrange}
                        </div>
                        <div className="col-span-2 text-blue-500 text-semibold border-r border-b border-graycolor p-1">
                          Landing Price
                        </div>
                        <div className="col-span-2 border-b border-r p-1">
                          {details.minprice}
                        </div>
                        <div className="col-span-2 border-b p-1">
                          {details.maxprice}
                        </div>
                        <div className="col-span-2 text-blue-500 text-semibold border-r border-b border-graycolor p-1">
                          Stock (Product Delivery)
                        </div>
                        <div className="col-span-4 border-b p-1">
                          {details.pdelivery}
                        </div>
                        <div className="col-span-2 text-blue-500 text-semibold border-r border-b border-graycolor p-1">
                          Delivery Location
                        </div>
                        <div className="col-span-4 border-b p-1">
                          {details.deliverylocation}
                        </div>
                        <div className="col-span-2 text-blue-500 text-semibold border-r border-graycolor p-1">
                          Estimate Delivery Date
                        </div>
                        <div className="col-span-4 p-1">{details.date}</div>
                      </div>
                    </div>
                  </>
                ) : (
                  ""
                )}
                {details.type == "Both" ? (
                  <>
                    <div className="border border-graycolor cursor-pointer">
                      <div className="grid grid-cols-6 px-4 p-1">
                        <div className="col-span-2 text-blue-500 text-semibold border-r border-b border-graycolor p-1">
                          Type
                        </div>
                        <div className="col-span-4 border-b p-1">
                          {details.type}
                        </div>
                        <div className="col-span-2 text-blue-500 text-semibold border-r border-b border-graycolor p-1">
                          Name
                        </div>
                        <div className="col-span-4 border-b p-1">
                          {details.name}
                        </div>
                        <div className="col-span-2 text-blue-500 text-semibold border-r border-b border-graycolor p-1">
                          Stock (Product Delivery)
                        </div>
                        <div className="col-span-4 border-b p-1">
                          {details.name}
                        </div>
                        <div className="col-span-2 text-blue-500 text-semibold border-r border-b border-graycolor p-1">
                          Product Name
                        </div>
                        <div className="col-span-4 border-b p-1">
                          {details.supplierpname}
                        </div>
                        <div className="col-span-2 text-blue-500 text-semibold border-r border-b border-graycolor p-1">
                          Stock Location
                        </div>
                        <div className="col-span-4 border-b p-1">
                          {details.stocklocation}
                        </div>
                        <div className="col-span-2 text-blue-500 text-semibold border-r border-b border-graycolor p-1">
                          Stock position
                        </div>
                        <div className="col-span-4 border-b p-1">
                          {details.stockposition}
                        </div>
                        <div className="col-span-2 text-blue-500 text-semibold border-r border-b border-graycolor p-1">
                          Pack Type
                        </div>
                        <div className="col-span-4 border-b p-1">
                          {details.packtype}
                        </div>
                        <div className="col-span-2 text-blue-500 text-semibold border-r border-b border-graycolor p-1">
                          Excepted Quantity
                        </div>
                        <div className="col-span-4 border-b p-1">
                          {details.expquantity}
                        </div>
                        <div className="col-span-2 text-blue-500 text-semibold border-r border-b border-graycolor p-1">
                          Excepted Price
                        </div>
                        <div className="col-span-4 border-b p-1">
                          {details.expprice}
                        </div>
                        <div className="col-span-2 text-blue-500 text-semibold border-r border-b border-graycolor p-1">
                          Stock Availability
                        </div>
                        <div className="col-span-4 border-b p-1">
                          {details.stockavailabilitydate}
                        </div>
                        <div className="col-span-2 text-blue-500 text-semibold border-r border-graycolor p-1">
                          Payment Mode
                        </div>
                        <div className="col-span-4 p-1">
                          {details.paymentmode}
                        </div>
                        <div className="col-span-2 text-blue-500 text-semibold border-r border-b border-graycolor p-1">
                          Quality Range
                        </div>
                        <div className="col-span-2 border-b border-r p-1">
                          {details.minrange}
                        </div>
                        <div className="col-span-2 border-b p-1">
                          {details.maxrange}
                        </div>
                        <div className="col-span-2 text-blue-500 text-semibold border-r border-b border-graycolor p-1">
                          Landing Price
                        </div>
                        <div className="col-span-2 border-b border-r p-1">
                          {details.minprice}
                        </div>
                        <div className="col-span-2 border-b p-1">
                          {details.maxprice}
                        </div>
                        <div className="col-span-2 text-blue-500 text-semibold border-r border-b border-graycolor p-1">
                          Stock (Product Delivery)
                        </div>
                        <div className="col-span-4 border-b p-1">
                          {details.pdelivery}
                        </div>
                        <div className="col-span-2 text-blue-500 text-semibold border-r border-b border-graycolor p-1">
                          Delivery Location
                        </div>
                        <div className="col-span-4 border-b p-1">
                          {details.deliverylocation}
                        </div>
                        <div className="col-span-2 text-blue-500 text-semibold border-r border-graycolor p-1">
                          Estimate Delivery Date
                        </div>
                        <div className="col-span-4 p-1">{details.date}</div>
                      </div>
                    </div>
                  </>
                ) : (
                  ""
                )}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button onClick={isUserDetailsClose} colorScheme="red" mr={3}>
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
                        lat: parseFloat(lat),
                        lng: parseFloat(lng),
                      }}
                    >
                      <Marker
                        position={{
                          lat: parseFloat(lat),
                          lng: parseFloat(lng),
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
export default Supplier;
