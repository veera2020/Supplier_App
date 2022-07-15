/*
 *  Document    : Moderatecustomer.js
 *  Author      : uyarchi
 *  Description : Moderate customer for price
 */
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { Breadcrumb } from "antd";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { useFormik } from "formik";
import * as Yup from "yup";
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
  ButtonGroup,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Alert,
  AlertDescription,
  AlertIcon,
  HStack,
  RadioGroup,
  Radio,
  Input,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import { DatePicker } from "antd";

//components
import Forms from "../controls/Forms";
import FormikErrorMessage from "../controls/FormikErrorMessage";
import InputFields from "../controls/InputFields";
import axios from "../../axios";
//useTable
const useTable = () => {
  const [Loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showLimit, setShowLimit] = useState(10);
  const [gridApi, setGridApi] = useState(null);
  const [rowData, setRowData] = useState([]);
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

//function init
const Moderatecustomer = () => {
  //router
  const router = useRouter();
  //table
  const EmployeeTable = useTable([]);
  //usestate
  const [name, setName] = useState("null");
  const [status, setStatus] = useState("null");
  const [openreason, setopenreason] = useState(false);
  const [empdetails, setempdetails] = useState("");
  const [reload, setreload] = useState(false);
  let ModurateData = [];

  EmployeeTable.rowData.map((item) =>
    item.status == "Accepted" && item.stockPosition == "ready"
      ? ModurateData.push(item)
      : null
  );

  //get employees
  const [id, setId] = useState("");
  const fetchdata = async (page = 1) => {
    EmployeeTable.setLoading(true);
    const response = await axios.get("/v1/requirementCollectionBS/Supplier");
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
  //modal for moderatefunc
  //usestate
  const [ismoderate, setIsmoderate] = useState(false);
  const [errormessageprice, seterrormessageprice] = useState("");
  const ismoderateClose = () => {
    formik.resetForm();
    setIsmoderate(false);
  };
  const moderatefunc = (props) => {
    setIsmoderate(true);
    console.log(props);
    axios
      .get(`/v1/requirementCollectionBS/Supplier/${props}`)
      .then((res) => setempdetails(res.data[0]));
  };
  //Formik InitialValue
  const initialvalue = {
    editedPrice: empdetails.expectedPrice,
    //   saveEditPrice: "",
  };
  //formik validation
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialvalue,
    validationSchema: Yup.object().shape({}),
    onSubmit: (values) => {
      console.log(values.editedPrice);
      if (empdetails.expectedPrice) {
        if (values.editedPrice > empdetails.expectedPrice) {
          console.log("maxprice");
          const data = {
            moderatedPrice: values.editedPrice,
            moderateStatus: "Moderated",
            //  saveEditPrice: values.saveEditPrice,
          };
          axios
            .put(`/v1/requirementCollectionBS/Supplier/${id}`, data)
            .then((res) => {
              console.log(res.data);
              setIsmoderate(false);
              setreload(!reload);
              formik.resetForm();
              onClose();
            })
            .catch((error) => {
              if (error.response) {
                console.log(error.response);
              }
            });
        } else {
          seterrormessageprice(
            "Moderate Price is Less than or equal to old Price"
          );
        }
      } else {
        if (values.editedPrice > empdetails.expprice) {
          console.log("expprice");
          const data = {
            moderatedPrice: values.editedPrice,
            moderateStatus: "Moderated",
          };
          axios
            .put(`/v1/requirementCollectionBS/Supplier/${id}`, data)
            .then((res) => {
              console.log(res.data);
              setIsmoderate(false);
              setreload(!reload);
              formik.resetForm();
            })
            .catch((error) => {
              if (error.response) {
                console.log(error.response);
              }
            });
        } else {
          seterrormessageprice(
            "Moderate Price is Less than or equal to old Price"
          );
        }
      }
      // if (
      //   values.editedPrice > empdetails.expprice
      //   // ||
      //   // values.editedPrice > empdetails.expprice
      // ) {
      //   console.log("hema");
      //   // const data = {
      //   //   editedPrice: values.editedPrice,
      //   // };
      //   // axios
      //   //   .put(`/v1/requirementCollection/${id}`, data)
      //   //   .then((res) => {
      //   //     console.log(res.data);
      //   //     setIsmoderate(false);
      //   //     setreload(!reload);
      //   //     formik.resetForm();
      //   //   })
      //   //   .catch((error) => {
      //   //     if (error.response) {
      //   //       console.log(error.response);
      //   //     }
      //   //   });
      // } else {
      //   seterrormessageprice(
      //     "Moderate Price is Less than or equal to old Price"
      //   );
      // }
    },
  });
  //for date
  const onChange = (date, dateString) => {
    console.log(date, dateString);
  };
  //modal for order details
  //usestate
  const [isshopopen, setIsshopopen] = useState(false);
  const [SupplierData, setSupplierData] = useState("");
  const isshopclose = () => {
    setIsshopopen(false);
  };
  const isSupplierDetails = (props) => {
    setIsshopopen(true);
    axios
      .get(`/v1/requirementCollectionBS/Supplier/${props}`)
      .then((res) => setSupplierData(res.data[0]));
  };
  //usestate
  const [isModurateopen, setIsModurateopen] = useState(false);
  const [Moduratedata, setModuratedata] = useState([]);
  const isModurateclose = () => {
    setIsModurateopen(false);
  };
  let ModuratePriceList = [];
  Moduratedata.map((item) =>
    item.moderatedPrice ? ModuratePriceList.push(item) : null
  );

  const isModuratePrice = (props) => {
    setIsModurateopen(true);
    axios
      .get(`/v1/requirementCollectionBS/Supplier/${props}`)
      .then((res) => setModuratedata(res.data));
  };
  //
  //statusrejectchange
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [errormessage, seterrormessage] = useState("");
  const onRejectClose = () => {
    setIsRejectOpen(false);
    seterrormessage(null);
  };
  const cancelRef = useRef();
  const RejectHandler = () => {
    {
      reason === "" || reason === "null"
        ? seterrormessage("Select Reason")
        : axiosfunc();
    }
  };
  const axiosfunc = () => {
    const data = {
      moderateReason: reason,
      moderateStatus: "Rejected",
    };
    axios
      .put(`/v1/requirementCollectionBS/Supplier/${id}`, data)
      .then((res) => {
        setreload(!reload);
        onRejectClose();
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
        }
      });
  };
  //usestate
  const [islastTimeUpdatedQty, setLastTimeUpdatedQty] = useState(false);
  const [UpdatedDetails, setUpdatedDetails] = useState([]);
  let UpdateQty = [];
  let UpdatePrice = [];
  let UpdateLocation = [];
  UpdatedDetails.map((item) => (item.updatedQty ? UpdateQty.push(item) : null));
  UpdatedDetails.map((item) => (item.price ? UpdatePrice.push(item) : null));
  UpdatedDetails.map((item) =>
    item.stockLocation ? UpdateLocation.push(item) : null
  );
  const isLastTimeUpdatedDetailClose = () => {
    setLastTimeUpdatedQty(false);
  };
  const UpdatedQtyList = (props) => {
    setLastTimeUpdatedQty(true);
    axios
      .get(`/v1/requirementCollectionBS/Supplier/UpdataData/${props}`)
      .then((res) => setUpdatedDetails(res.data));
  };
  //usestate
  const [islastTimeUpdatedPrice, setLastTimeUpdatedPrice] = useState(false);
  const isLastTimeUpdatedPriceClose = () => {
    setLastTimeUpdatedPrice(false);
  };
  const UpdatedPriceList = (props) => {
    setLastTimeUpdatedPrice(true);
    axios
      .get(`/v1/requirementCollectionBS/Supplier/UpdataData/${props}`)
      .then((res) => setUpdatedDetails(res.data));
  };
  //usestate
  const [islastTimeUpdatedLocation, setLastTimeUpdatedLocation] =
    useState(false);
  const isLastTimeUpdatedLocationClose = () => {
    setLastTimeUpdatedLocation(false);
  };
  const UpdatedLocationList = (props) => {
    setLastTimeUpdatedLocation(true);
    axios
      .get(`/v1/requirementCollectionBS/Supplier/UpdataData/${props}`)
      .then((res) => setUpdatedDetails(res.data));
  };
  const { isOpen, onOpen, onClose } = useDisclosure();
  //const cancelRef = React.useRef();
  //time split
  const Time = (props) => {
    const a = props.data.item.time;
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
        <title>Supplier/Buyer App - Moderate Customers</title>
        <meta name="description" content="Generated by create next app" />
      </Head>
      <div className="p-4 ">
        <div className="w-full pb-4">
          <Breadcrumb separator=">">
            <Breadcrumb.Item href="/home">Home</Breadcrumb.Item>
            <Breadcrumb.Item>Moderate Customers</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr className="p-1"></hr>
        <div className="flex items-center pb-4">
          <span className="flex-auto text-sky-500 text-xl">
            Moderate Customers
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
        <hr className="p-1"></hr>
        <div className="flex items-center gap-3 pb-4">
          <div className="flex-auto font-semibold text-primary"></div>
          <DatePicker onChange={onChange} />
          {/* <select
            placeholder="Select"
            style={{ outline: 0 }}
            className="border border-graycolor w-36 focus-outline-none bg-whitecolor experience p-1"
            // onChange={(e) => {
            //   setUserId(e.target.value);
            //   e.target.classList.add("change_color");
            //   getpzone(e.target.value);
            // }}
          >
            <option value="null">Select Type</option>
            <option value="Buyer">Buyer</option>
            <option value="Supplier">Supplier</option>
            <option value="Both">Both</option>
          </select> */}
          <select
            onChange={(e) => {
              setStatus(e.target.value);
              e.target.classList.add("change_color");
            }}
            style={{ outline: 0 }}
            className="border border-graycolor w-36 focus-outline-none bg-whitecolor experience p-1"
            required
          >
            <option value="null">Select Status</option>
            {Status &&
              Status.map((item, index) => (
                <option key={index} value={item.value}>
                  {item.label}
                </option>
              ))}
          </select>
          <div className="flex text-center pr-2 gap-2">
            <Button
              colorScheme="blue"
              // onClick={handlesearch}
            >
              Go
            </Button>
          </div>
        </div>
        <div className="border-gray-500 scroll-smooth border overflow-y-scroll">
          <Table
            size="sm"
            scaleY="44"
            variant="striped"
            colorScheme="whatsapp"
            className="overflow-auto"
          >
            <Thead className="bg-headergreen">
              <Tr>
                <Th textAlign="center">S.No</Th>
                <Th textAlign="center">Date</Th>
                <Th textAlign="center">Registered By whom</Th>
                <Th textAlign="center">Requirement Id</Th>
                <Th textAlign="center">Name</Th>
                <Th textAlign="center">Product</Th>
                <Th textAlign="center">updated qty (live)</Th>
                <Th textAlign="center">price per kg(live)</Th>
                <Th textAlign="center">Moderated Price</Th>
                <Th textAlign="center">Status</Th>
                <Th textAlign="center">Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {ModurateData != "" ? null : (
                <Tr>
                  <Td
                    style={{ textAlign: "center" }}
                    className="font-semibold"
                    colSpan="11"
                  >
                    No Data Found
                  </Td>
                </Tr>
              )}
              {ModurateData &&
                ModurateData.map((item, index) => (
                  <Tr key={index}>
                    <Td textAlign="center">{index + 1}</Td>
                    <Td textAlign="center" className="w-32">
                      {item.date}
                    </Td>
                    <Td textAlign="center">{item.requirementAddBy}</Td>
                    <Td textAlign="center">{item.secretName}</Td>
                    <Td textAlign="center">
                      <Button
                        size="md"
                        colorScheme="blue"
                        variant="link"
                        onClick={() => isSupplierDetails(item._id)}
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
                          UpdatedQtyList(item._id);
                        }}
                      >
                        {item.expectedQnty}
                      </Button>
                    </Td>
                    <Td textAlign="center">
                      <Button
                        size="md"
                        colorScheme="blue"
                        variant="link"
                        onClick={() => {
                          UpdatedPriceList(item._id);
                        }}
                      >
                        {item.expectedPrice}
                      </Button>
                    </Td>
                    <Td textAlign="center">
                      {item.moderatedPrice === null ? (
                        <div>Nil</div>
                      ) : (
                        <Button
                          size="md"
                          colorScheme="blue"
                          variant="link"
                          onClick={() => isModuratePrice(item._id)}
                        >
                          {item.moderatedPrice}
                        </Button>
                      )}
                    </Td>
                    {item.moderateStatus === "" ? (
                      <Td textAlign="center">Nil</Td>
                    ) : (
                      <Td textAlign="center">{item.moderateStatus}</Td>
                    )}
                    <Td textAlign="center">
                      {item.moderateStatus === "Rejected" ? (
                        <Button
                          size="xs"
                          colorScheme="red"
                          onClick={() => moderatefunc(item._id)}
                          disabled
                        >
                          {item.moderateStatus}
                        </Button>
                      ) : (
                        // <ButtonGroup
                        //   spacing="1"
                        //   onClick={() => setId(item._id)}
                        // >
                        //   <Button
                        //     size="xs"
                        //     colorScheme="blue"
                        //     onClick={() => moderatefunc(item._id)}
                        //   >
                        //     Moderate
                        //   </Button>
                        //   <Button
                        //     size="xs"
                        //     colorScheme="red"
                        //     onClick={() => setIsRejectOpen(true)}
                        //   >
                        //     Reject
                        //   </Button>
                        // </ButtonGroup>
                        <ButtonGroup
                          spacing="1"
                          onClick={() => setId(item._id)}
                        >
                          <Button
                            size="xs"
                            colorScheme="blue"
                            onClick={() => moderatefunc(item._id)}
                          >
                            Moderate
                          </Button>
                          <Button
                            size="xs"
                            colorScheme="red"
                            onClick={() => setIsRejectOpen(true)}
                          >
                            Reject
                          </Button>
                        </ButtonGroup>
                      )}
                    </Td>
                  </Tr>
                ))}
            </Tbody>
          </Table>
        </div>
        <Modal isOpen={isshopopen} onClose={isshopclose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Orders Details</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <div className="border border-graycolor cursor-pointer">
                <div className="grid grid-cols-5 px-4">
                  <div className="col-span-2 text-blue-500 text-semibold border-r border-graycolor p-1">
                    Product Name
                  </div>
                  <div className="col-span-3 p-1">{SupplierData.product}</div>
                </div>
                <div className="grid grid-cols-5 px-4 border-t border-graycolor">
                  <div className="col-span-2 text-blue-500 text-semibold border-r border-graycolor p-1">
                    Stock Location
                  </div>
                  <div className="col-span-3 p-1">
                    {SupplierData.stockLocation}
                  </div>
                </div>
                <div className="grid grid-cols-5 px-4 border-t border-graycolor">
                  <div className="col-span-2 text-blue-500 text-semibold border-r border-graycolor p-1">
                    Stock Position
                  </div>
                  <div className="col-span-3 p-1">
                    {SupplierData.stockPosition}
                  </div>
                </div>
                <div className="grid grid-cols-5 px-4 border-t border-graycolor">
                  <div className="col-span-2 text-blue-500 text-semibold border-r border-graycolor p-1">
                    Packed Type
                  </div>
                  <div className="col-span-3 p-1">{SupplierData.packType}</div>
                </div>
                <div className="grid grid-cols-5 px-4 border-t border-graycolor">
                  <div className="col-span-2 text-blue-500 text-semibold border-r border-graycolor p-1">
                    Excepted Quantity
                  </div>
                  <div className="col-span-3 p-1">
                    {SupplierData.expectedQnty}
                  </div>
                </div>
                <div className="grid grid-cols-5 px-4 border-t border-graycolor">
                  <div className="col-span-2 text-blue-500 text-semibold border-r border-graycolor p-1">
                    Excepted Price
                  </div>
                  <div className="col-span-3 p-1">
                    {SupplierData.expectedPrice}
                  </div>
                </div>
                <div className="grid grid-cols-5 px-4 border-t border-graycolor">
                  <div className="col-span-2 text-blue-500 text-semibold border-r border-graycolor p-1">
                    Payment Mode
                  </div>
                  <div className="col-span-3 p-1">
                    {SupplierData.paymentMode}
                  </div>
                </div>
                {SupplierData.paymentMode == "advance" ? (
                  <div className="grid grid-cols-5 px-4 border-t border-graycolor">
                    <div className="col-span-2 text-blue-500 text-semibold border-r border-graycolor p-1">
                      Advance
                    </div>
                    <div className="col-span-3 p-1">{SupplierData.advance}</div>
                  </div>
                ) : null}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button onClick={isshopclose} colorScheme="blue" mr={3}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Modal isOpen={ismoderate} onClose={ismoderateClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Moderate Price</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Forms className="space-y-5">
                <div className="flex gap-1">
                  <label className="font-semibold">Price per Kg -</label>
                  <div>{empdetails.expectedPrice}</div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-semibold">
                    Moderate Price
                    <span className="text-secondary pb-2">*</span>
                  </label>
                  <InputFields
                    type="number"
                    name="editedPrice"
                    value={formik.values.editedPrice || ""}
                    onChange={(e) => {
                      seterrormessageprice("");
                      formik.handleChange(e);
                    }}
                    // onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={
                      formik.touched.editedPrice && formik.errors.editedPrice
                        ? "input-primary ring-2 ring-secondary border-none"
                        : "input-primary"
                    }
                  />
                </div>
                {formik.touched.editedPrice && formik.errors.editedPrice ? (
                  <FormikErrorMessage>
                    {formik.errors.editedPrice}
                  </FormikErrorMessage>
                ) : null}
                {/* {formik.touched.editedPrice && formik.errors.editedPrice ? (
                      <FormikErrorMessage>
                        {formik.errors.editedPrice}
                      </FormikErrorMessage>
                    ) : null}
                    <div className="flex flex-col gap-2">
                      <label className="font-semibold">
                        Moderate Price
                        <span className="text-secondary pb-2">*</span>
                      </label>
                      <InputFields
                        type="number"
                        name="editedPrice"
                        value={formik.values.editedPrice || ""}
                        onChange={(e) => {
                          seterrormessageprice("");
                          formik.handleChange(e);
                        }}
                        // onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={
                          formik.touched.editedPrice &&
                          formik.errors.editedPrice
                            ? "input-primary ring-2 ring-secondary border-none"
                            : "input-primary"
                        }
                      />
                    </div>
                    {formik.touched.editedPrice && formik.errors.editedPrice ? (
                      <FormikErrorMessage>
                        {formik.errors.editedPrice}
                      </FormikErrorMessage>
                    ) : null}
                {/* {formik.values.saveEditPrice != "" ? (
                  <>
                    <div className="flex flex-col gap-2">
                      <label className="font-semibold text-center text-size-lg">
                        Are you Sure. Do you want to moderate User
                      </label>
                    </div>
                    {/* <div className="flex flex-col gap-2">
                      <label className="font-semibold">
                        Edited Price
                        <span className="text-secondary pb-2">*</span>
                      </label>
                      <div>{empdetails.expectedPrice}</div>
                    </div> */}
                {/* {formik.touched.editedPrice && formik.errors.editedPrice ? (
                      <FormikErrorMessage>
                        {formik.errors.editedPrice}
                      </FormikErrorMessage>
                    ) : null}
                    <div className="flex flex-col gap-2">
                      <label className="font-semibold">
                        Moderate Price
                        <span className="text-secondary pb-2">*</span>
                      </label>
                      <InputFields
                        type="number"
                        name="editedPrice"
                        value={formik.values.editedPrice || ""}
                        onChange={(e) => {
                          seterrormessageprice("");
                          formik.handleChange(e);
                        }}
                        // onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={
                          formik.touched.editedPrice &&
                          formik.errors.editedPrice
                            ? "input-primary ring-2 ring-secondary border-none"
                            : "input-primary"
                        }
                      />
                    </div>
                    {formik.touched.editedPrice && formik.errors.editedPrice ? (
                      <FormikErrorMessage>
                        {formik.errors.editedPrice}
                      </FormikErrorMessage>
                    ) : null}
                  </>
                ) : (
                  <>
                    <div className="flex flex-col gap-2">
                      <label className="font-semibold">
                        Edited Price
                        <span className="text-secondary pb-2">*</span>
                      </label>
                      <InputFields
                        type="number"
                        name="editedPrice"
                        value={formik.values.editedPrice || ""}
                        // onChange={(e) => {
                        //   seterrormessageprice("");
                        //   formik.handleChange(e);
                        // }}
                        // // onChange={formik.handleChange}
                        // onBlur={formik.handleBlur}
                        className={
                          formik.touched.editedPrice &&
                          formik.errors.editedPrice
                            ? "input-primary ring-2 ring-secondary border-none"
                            : "input-primary"
                        }
                        disabled
                      />
                    </div>
                    {formik.touched.editedPrice && formik.errors.editedPrice ? (
                      <FormikErrorMessage>
                        {formik.errors.editedPrice}
                      </FormikErrorMessage>
                    ) : null}
                    <div className="flex flex-col gap-2">
                      <label className="font-semibold">
                        Modurate Price
                        <span className="text-secondary pb-2">*</span>
                      </label>
                      <InputFields
                        type="number"
                        name="editedPrice"
                        value={formik.values.editedPrice || ""}
                        onChange={(e) => {
                          seterrormessageprice("");
                          formik.handleChange(e);
                        }}
                        // onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={
                          formik.touched.editedPrice &&
                          formik.errors.editedPrice
                            ? "input-primary ring-2 ring-secondary border-none"
                            : "input-primary"
                        }
                      />
                    </div>
                    {formik.touched.editedPrice && formik.errors.editedPrice ? (
                      <FormikErrorMessage>
                        {formik.errors.editedPrice}
                      </FormikErrorMessage>
                    ) : null}
                    <div className="flex flex-col gap-2">
                      <label className="font-semibold"></label>
                      <Button
                        onClick={() =>
                          formik.setFieldValue("saveEditPrice", "save")
                        }
                        colorScheme="blue"
                      >
                        save
                      </Button>
                    </div>
                  </>
                )} */}
              </Forms>
            </ModalBody>
            <ModalFooter>
              <Button
                onClick={onOpen}
                //  onClick={formik.handleSubmit}
                colorScheme="green"
                mr={3}
              >
                Yes
              </Button>
              <Button type="button" colorScheme="red" mr={3}>
                No
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Modal isOpen={isModurateopen} onClose={isModurateclose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Moderated Price List</ModalHeader>
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
                      <Th textAlign="center">moderate price</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {EmployeeTable.rowData != "" ? null : (
                      <Tr>
                        <Td
                          style={{ textAlign: "center" }}
                          className="font-semibold"
                          colSpan="11"
                        >
                          No Data Found
                        </Td>
                      </Tr>
                    )}
                    {ModuratePriceList &&
                      ModuratePriceList.map((item, index) => (
                        <Tr colSpan="2" key={index}>
                          <Td textAlign="center">{index + 1}</Td>
                          <Td textAlign="center">{item.date}</Td>
                          <Td textAlign="center" className="">
                            <Time data={{ item }} />
                          </Td>
                          <Td textAlign="center">{item.moderatedPrice}</Td>
                        </Tr>
                      ))}
                  </Tbody>
                </Table>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button onClick={isModurateclose} colorScheme="blue" mr={3}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Modal
          isOpen={islastTimeUpdatedQty}
          onClose={isLastTimeUpdatedDetailClose}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Updated Quantity List</ModalHeader>
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
                      <Th textAlign="center">Changed Qty</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {UpdatedDetails != "" ? null : (
                      <Tr>
                        <Td
                          style={{ textAlign: "center" }}
                          className="font-semibold"
                          colSpan="11"
                        >
                          No Data Found
                        </Td>
                      </Tr>
                    )}
                    {UpdateQty &&
                      UpdateQty.map((item, index) => (
                        <Tr colSpan="2" key={index}>
                          <Td textAlign="center">{index + 1}</Td>
                          <Td textAlign="center">{item.date}</Td>
                          <Td textAlign="center">{item.time}</Td>
                          <Td textAlign="center">{item.updatedQty}</Td>
                        </Tr>
                      ))}
                  </Tbody>
                </Table>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                onClick={isLastTimeUpdatedDetailClose}
                colorScheme="blue"
                mr={3}
              >
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Modal
          isOpen={islastTimeUpdatedPrice}
          onClose={isLastTimeUpdatedPriceClose}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Updated Time Price</ModalHeader>
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
                    {EmployeeTable.rowData != "" ? null : (
                      <Tr>
                        <Td
                          style={{ textAlign: "center" }}
                          className="font-semibold"
                          colSpan="11"
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
                          <Td textAlign="center">{item.time}</Td>
                          <Td textAlign="center">{item.price}</Td>
                        </Tr>
                      ))}
                  </Tbody>
                </Table>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                onClick={isLastTimeUpdatedPriceClose}
                colorScheme="blue"
                mr={3}
              >
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={onClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Delete Customer
              </AlertDialogHeader>

              <AlertDialogBody>
                {errormessageprice && (
                  <div className="pb-5">
                    <Alert status="error">
                      <AlertIcon />
                      <AlertDescription>{errormessageprice}</AlertDescription>
                    </Alert>
                  </div>
                )}
                Are you sure? Do You want to moderate the Price.
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onClose}>
                  Cancel
                </Button>
                <Button colorScheme="red" onClick={formik.handleSubmit} ml={3}>
                  Moderate
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
        {isRejectOpen && (
          <AlertDialog
            isOpen={isRejectOpen}
            leastDestructiveRef={cancelRef}
            onClose={onRejectClose}
          >
            <AlertDialogOverlay>
              <AlertDialogContent>
                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                  Reject Customer
                </AlertDialogHeader>
                <AlertDialogBody>
                  <div className="text-md pb-3">
                    Are you sure, Do you want to reject this customer?
                  </div>
                  <ButtonGroup>
                    <Button
                      size="xs"
                      onClick={() => setopenreason(true)}
                      colorScheme="blue"
                    >
                      Yes
                    </Button>
                    <Button
                      size="xs"
                      colorScheme="red"
                      onClick={() => setIsRejectOpen(false)}
                    >
                      No
                    </Button>
                  </ButtonGroup>
                  {openreason && (
                    <>
                      <div className="font-semibold text-sm pt-3">
                        Reason For Reject
                      </div>
                      <select
                        name="resonReject"
                        onChange={(e) => {
                          setReason(e.target.value);
                          seterrormessage(null);
                        }}
                        className="border border-graycolor w-36 bg-whitecolor focus-outline-none experience m-2"
                      >
                        <option value="null">Select Reason</option>
                        <option value="Irrelevent Price of the Product">
                          Irrelevent Price of the Product
                        </option>
                        <option value="Over Rated">Over Rated</option>
                      </select>
                    </>
                  )}
                  {errormessage && (
                    <div className="pb-5">
                      <Alert status="error">
                        <AlertIcon />
                        <AlertDescription>{errormessage}</AlertDescription>
                      </Alert>
                    </div>
                  )}
                </AlertDialogBody>
                <AlertDialogFooter>
                  <Button ref={cancelRef} onClick={onRejectClose}>
                    Cancel
                  </Button>
                  {reason == "" ? (
                    ""
                  ) : (
                    <Button colorScheme="red" onClick={RejectHandler} ml={3}>
                      Reject
                    </Button>
                  )}
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>
        )}
      </div>
    </>
  );
};
export default Moderatecustomer;
