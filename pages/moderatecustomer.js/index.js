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

//function init
const Moderatecustomer = () => {
  //router
  const router = useRouter();
  //usestate
  const [name, setName] = useState("null");
  const [status, setStatus] = useState("null");
  const [openreason, setopenreason] = useState(false);
  const [empdetails, setempdetails] = useState("");
  const [reload, setreload] = useState(false);
  const [lat, setlat] = useState("");
  const [lng, setlng] = useState("");
  //table
  const EmployeeTable = useTable();
  //get employees
  const [id, setId] = useState("");
  const fetchdata = async (page = 1) => {
    EmployeeTable.setLoading(true);
    const response = await axios.get("/v1/requirementCollection");
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
      .get(`/v1/requirementCollection/${props}`)
      .then((res) => setempdetails(res.data));
  };
  //Formik InitialValue
  const initialvalue = {
    editedPrice: empdetails.expprice || empdetails.maxprice,
  };
  //formik validation
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialvalue,
    validationSchema: Yup.object().shape({}),
    onSubmit: (values) => {
      console.log(values.editedPrice);
      if (empdetails.maxprice) {
        if (values.editedPrice > empdetails.maxprice) {
          console.log("maxprice");
          const data = {
            editedPrice: values.editedPrice,
            moderateStatus: "Moderated",
          };
          axios
            .put(`/v1/requirementCollection/${id}`, data)
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
      } else {
        if (values.editedPrice > empdetails.expprice) {
          console.log("expprice");
          const data = {
            editedPrice: values.editedPrice,
            moderateStatus: "Moderated",
          };
          axios
            .put(`/v1/requirementCollection/${id}`, data)
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
  const [shop, setshop] = useState("");
  const isshopclose = () => {
    setIsshopopen(false);
  };
  const isopenshop = (props) => {
    setIsshopopen(true);
    axios
      .get(`/v1/requirementCollection/${props}`)
      .then((res) => setshop(res.data));
  };
  //modal for map
  const { isOpen, onOpen, onClose } = useDisclosure();
  //mapview
  const isOpenmap = (props) => {
    onOpen();
    setlat(props.latitude);
    setlng(props.longitude);
  };
  const mapStyles = {
    height: "100%",
    width: "100%",
  };
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
      moderateRejectReason: reason,
      moderateStatus: "Rejected",
    };
    axios
      .put(`/v1/requirementCollection/${id}`, data)
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
          <select
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
          </select>
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
                <Th>S.No</Th>
                <Th>Date</Th>
                <Th>Type</Th>
                <Th>Name</Th>
                <Th>Product</Th>
                <Th>Map View</Th>
                <Th>Old Price</Th>
                <Th>Moderated Price</Th>
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
                  <Tr key={index}>
                    <Td>{index + 1}</Td>
                    <Td>{item.Date}</Td>
                    <Td>{item.type}</Td>
                    <Td>
                      <Button
                        size="md"
                        colorScheme="blue"
                        variant="link"
                        onClick={() => isopenshop(item._id)}
                      >
                        {item.name}
                      </Button>
                    </Td>
                    <Td>
                      {item.buyerpname === "" ? (
                        <div>{item.supplierpname}</div>
                      ) : (
                        <div>{item.buyerpname}</div>
                      )}
                    </Td>
                    {/* {item.buyerpname === "" ? (
                      <Td>{item.supplierpname}</Td>
                    ) : (
                      <Td>{item.buyerpname}</Td>
                    )} */}
                    <Td>
                      {item.type == "Buyer" ? (
                        <Button
                          size="sm"
                          colorScheme="blue"
                          variant="link"
                          onClick={() => isOpenmap(item)}
                        >
                          MapView
                        </Button>
                      ) : null}
                      {item.type == "Both" ? (
                        item.selectboth == "Buyer" ? (
                          <Button
                            size="sm"
                            colorScheme="blue"
                            variant="link"
                            onClick={() => isOpenmap(item)}
                          >
                            MapView
                          </Button>
                        ) : null
                      ) : null}
                    </Td>
                    <Td>
                      {item.maxprice === null && item.expprice === null ? (
                        <div>Nil</div>
                      ) : (
                        <div>{item.expprice || item.maxprice}</div>
                      )}
                    </Td>
                    {/* {item.maxprice === null && item.expprice === null ? (
                      <Td>Nil</Td>
                    ) : (
                      <Td>{item.expprice || item.maxprice}</Td>
                    )} */}
                    <Td>
                      {item.editedPrice === "" ? (
                        <div>Nil</div>
                      ) : (
                        <div>{item.editedPrice}</div>
                      )}
                    </Td>
                    {/* {item.editedPrice === "" ? (
                      <Td>Nil</Td>
                    ) : (
                      <Td>{item.editedPrice}</Td>
                    )} */}
                    <Td>
                      {item.moderateStatus === "" ? (
                        <Td>Pending</Td>
                      ) : (
                        <Td>{item.moderateStatus}</Td>
                      )}
                    </Td>
                    <Td>
                      {item.moderateStatus === "" ? (
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
                      ) : (
                        // <Button size="xs" colorScheme="blue" disabled>
                        //   {item.moderateStatus}
                        // </Button>
                        <ButtonGroup
                          spacing="1"
                          onClick={() => setId(item._id)}
                        >
                          <Button
                            disabled
                            size="xs"
                            colorScheme="blue"
                            onClick={() => moderatefunc(item._id)}
                          >
                            Moderate
                          </Button>
                          <Button
                            disabled
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
              {shop.type === "Buyer" ? (
                <div className="border border-graycolor cursor-pointer">
                  <div className="grid grid-cols-5 px-4">
                    <div className="col-span-1 text-blue-500 text-semibold border-r border-graycolor p-1">
                      Product Name
                    </div>
                    <div className="col-span-4 p-1">{shop.buyerpname}</div>
                  </div>
                  <div className="grid grid-cols-5 px-4 border-t border-graycolor">
                    <div className="col-span-1 text-blue-500 text-semibold border-r border-graycolor p-1">
                      Quantity Range
                    </div>
                    <div className="col-span-4 p-1">
                      {shop.minrange} to {shop.maxrange}
                    </div>
                  </div>
                  <div className="grid grid-cols-5 px-4 border-t border-graycolor">
                    <div className="col-span-1 text-blue-500 text-semibold border-r border-graycolor p-1">
                      Landing Price
                    </div>
                    <div className="col-span-4 p-1">
                      {shop.minprice} to {shop.maxprice}
                    </div>
                  </div>
                  <div className="grid grid-cols-5 px-4 border-t border-graycolor">
                    <div className="col-span-1 text-blue-500 text-semibold border-r border-graycolor p-1">
                      Stock (Product Delivery)
                    </div>
                    <div className="col-span-4 p-1">{shop.pdelivery}</div>
                  </div>
                  {shop.pdelivery === "Delivery to Location" ? (
                    <div className="grid grid-cols-5 px-4 border-t border-graycolor">
                      <div className="col-span-1 text-blue-500 text-semibold border-r border-graycolor p-1">
                        Delivery Location
                      </div>
                      <div className="col-span-4 p-1">
                        {shop.deliverylocation}
                      </div>
                    </div>
                  ) : null}
                  <div className="grid grid-cols-5 px-4 border-t border-graycolor">
                    <div className="col-span-1 text-blue-500 text-semibold border-r border-graycolor p-1">
                      Estimated Delivery Date
                    </div>
                    <div className="col-span-4 p-1">
                      {shop.buyerdeliverydate}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="border border-graycolor cursor-pointer">
                  <div className="grid grid-cols-5 px-4">
                    <div className="col-span-1 text-blue-500 text-semibold border-r border-graycolor p-1">
                      Product Name
                    </div>
                    <div className="col-span-4 p-1">{shop.supplierpname}</div>
                  </div>
                  <div className="grid grid-cols-5 px-4 border-t border-graycolor">
                    <div className="col-span-1 text-blue-500 text-semibold border-r border-graycolor p-1">
                      Stock Location
                    </div>
                    <div className="col-span-4 p-1">{shop.stocklocation}</div>
                  </div>
                  <div className="grid grid-cols-5 px-4 border-t border-graycolor">
                    <div className="col-span-1 text-blue-500 text-semibold border-r border-graycolor p-1">
                      Stock Position
                    </div>
                    <div className="col-span-4 p-1">{shop.stockposition}</div>
                  </div>
                  {shop.stockposition === "Ready" ? (
                    <>
                      <div className="grid grid-cols-5 px-4 border-t border-graycolor">
                        <div className="col-span-1 text-blue-500 text-semibold border-r border-graycolor p-1">
                          Packed Type
                        </div>
                        <div className="col-span-4 p-1">{shop.packtype}</div>
                      </div>
                      <div className="grid grid-cols-5 px-4 border-t border-graycolor">
                        <div className="col-span-1 text-blue-500 text-semibold border-r border-graycolor p-1">
                          Excepted Quantity
                        </div>
                        <div className="col-span-4 p-1">{shop.expquantity}</div>
                      </div>
                      <div className="grid grid-cols-5 px-4 border-t border-graycolor">
                        <div className="col-span-1 text-blue-500 text-semibold border-r border-graycolor p-1">
                          Excepted Price
                        </div>
                        <div className="col-span-4 p-1">{shop.expprice}</div>
                      </div>
                    </>
                  ) : (
                    <div className="grid grid-cols-5 px-4 border-t border-graycolor">
                      <div className="col-span-1 text-blue-500 text-semibold border-r border-graycolor p-1">
                        Stock Availability
                      </div>
                      <div className="col-span-4 p-1">
                        {shop.stockavailabilitydate}
                      </div>
                    </div>
                  )}
                  <div className="grid grid-cols-5 px-4 border-t border-graycolor">
                    <div className="col-span-1 text-blue-500 text-semibold border-r border-graycolor p-1">
                      Payment Mode
                    </div>
                    <div className="col-span-4 p-1">{shop.paymentmode}</div>
                  </div>
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              <Button onClick={isshopclose} colorScheme="blue" mr={3}>
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
        <Modal isOpen={ismoderate} onClose={ismoderateClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Moderate Price</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Forms>
                {errormessageprice && (
                  <div className="pb-5">
                    <Alert status="error">
                      <AlertIcon />
                      <AlertDescription>{errormessageprice}</AlertDescription>
                    </Alert>
                  </div>
                )}
                <div className="flex flex-col gap-2">
                  <label className="font-semibold">
                    Edited Price
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
              </Forms>
            </ModalBody>
            <ModalFooter>
              <Button onClick={formik.handleSubmit} colorScheme="blue">
                Update
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
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
