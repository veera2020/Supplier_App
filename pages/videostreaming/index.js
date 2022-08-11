/*
 *  Document    : Video Streaming
 *  Author      : uyarchi
 *  Description : Live Video Streaming
 */
import { useState, useEffect, useRef } from "react";
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
  Textarea,
  ButtonGroup,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Alert,
  AlertDescription,
  AlertIcon,
} from "@chakra-ui/react";
//components
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
const VideoStreaming = () => {
  //router
  const router = useRouter();
  //usestate
  const [reload, setreload] = useState(false);
  //table
  const EmployeeTable = useTable();
  //get employees

  const fetchdata = async (page = 1) => {
    EmployeeTable.setLoading(true);
    const response = await axios.get(
      "/v1/requirementCollectionBS/SupplierLiveStrem/all/data"
    );
    if (response.status === 200 && response.data) {
      EmployeeTable.setRowData(response.data);
      console.log(response.data);
    } else {
      EmployeeTable.setRowData([]);
    }
  };
  //useEffect
  useEffect(() => {
    fetchdata(EmployeeTable.currentPage, EmployeeTable.showLimit);
  }, [reload, EmployeeTable.currentPage, EmployeeTable.showLimit]);
  //statusapprovechange
  const [id, setId] = useState("");
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const onApproveClose = () => {
    setIsApproveOpen(false);
  };
  const cancelApproveRef = useRef();
  const ApproveHandler = () => {
    axiosApproovefunc();
  };
  const axiosApproovefunc = () => {
    const data = {
      liveStreamStatus: "Approved",
    };
    axios
      .put(`/v1/requirementCollectionBS/Supplier/${id}`, data)
      .then((res) => {
        setreload(!reload);
        onApproveClose();
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
        }
      });
  };
  //statusrejectchange
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [errormessage, seterrormessage] = useState("");
  const onRejectClose = () => {
    setIsRejectOpen(false);
    seterrormessage(null);
  };
  const cancelRejectRef = useRef();
  const RejectHandler = () => {
    {
      reason === "" || reason === "null"
        ? seterrormessage("Select Reason")
        : axiosfunc();
    }
  };
  const axiosfunc = () => {
    const data = {
      liveStreamReason: reason,
      liveStreamStatus: "Rejected",
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
  const [isSupplierDetails, setIsSuppierDetails] = useState(false);
  const [details, setDetails] = useState("");
  console.log(details);
  const isSupplierDetailsClose = () => {
    setIsSuppierDetails(false);
  };
  const SupplierDetail = (props) => {
    setIsSuppierDetails(true);
    axios.get(`/v1/supplier/${props}`).then((res) => setDetails(res.data));
  };
  //usestate
  const [isProductDetails, setIsProductDetails] = useState(false);
  const [pdetails, setPDetails] = useState("");
  const isProductDetailsClose = () => {
    setIsProductDetails(false);
  };
  const ProductDetail = (props) => {
    setIsProductDetails(true);
    axios
      .get(`/v1/supplierAppUser/responce/${props}`)
      .then((res) => setPDetails(res.data[0].supplierslotsubmits.data[0]));
  };
  const Time = (props) => {
    const a = props.data;
    console.log(a);
    const first2Str = String(a).slice(0, 2); // 👉️ '13'
    const second2Str = String(a).slice(2, 4); // 👉️ '13'
    const final = first2Str + ":" + second2Str;
    return <>{final}</>;
  };
  const Date = (props) => {
    // yyyy-MM-dd
    const input = props.data;
    const [year, month, day] = input.split("-");
    // dd/mm/yyyy
    const dateformat = `${day}-${month}-${year}`;
    return <>{dateformat}</>;
  };
  return (
    <>
      <Head>
        <title>Supplier/Buyer App - VideoStreaming</title>
        <meta name="description" content="Generated by create next app" />
      </Head>
      <div className="p-4 ">
        <div className="w-full pb-4">
          <Breadcrumb separator=">">
            <Breadcrumb.Item href="/home">Home</Breadcrumb.Item>
            <Breadcrumb.Item>VideoStreaming</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr className="p-1"></hr>
        <div className="flex items-center pb-4">
          <span className="flex-auto text-sky-500 text-xl">
            Video Streaming-Admin
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
                <Th textAlign="center">Supplier_Id</Th>
                <Th textAlign="center">Date</Th>
                <Th textAlign="center">Time</Th>
                <Th textAlign="center">Product</Th>
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
                    colSpan="7"
                  >
                    No Data Found
                  </Td>
                </Tr>
              )}
              {EmployeeTable.rowData &&
                EmployeeTable.rowData.map((item, index) => (
                  <Tr colSpan="2" key={index}>
                    <Td textAlign="center">{index + 1}</Td>
                    <Td textAlign="center">
                      <Button
                        size="md"
                        colorScheme="blue"
                        variant="link"
                        onClick={() => {
                          SupplierDetail(item.userId);
                        }}
                      >
                        {item.secretName}
                      </Button>
                    </Td>
                    <Td textAlign="center">
                      {<Date data={item.liveStreamDate} />}
                    </Td>
                    <Td textAlign="center">
                      {<Time data={item.liveStreamTime} />}
                    </Td>
                    <Td textAlign="center">{item.product}</Td>
                    <Td textAlign="center">
                      {!item.liveStreamStatus ? (
                        <div>Pending</div>
                      ) : (
                        <div>{item.liveStreamStatus}</div>
                      )}
                    </Td>
                    <Td textAlign="center">
                      {!item.liveStreamStatus ? (
                        <ButtonGroup
                          spacing="1"
                          onClick={() => setId(item._id)}
                        >
                          <Button
                            size="xs"
                            colorScheme="blue"
                            onClick={() => setIsApproveOpen(true)}
                          >
                            Approve
                          </Button>
                          <Button
                            size="xs"
                            colorScheme="red"
                            onClick={() => setIsRejectOpen(true)}
                          >
                            Reject
                          </Button>
                        </ButtonGroup>
                      ) : item.liveStreamStatus == "Approved" ? (
                        <Button size="xs" colorScheme="green">
                          {item.liveStreamStatus}
                        </Button>
                      ) : item.liveStreamStatus == "Rejected" ? (
                        <Button size="xs" colorScheme="red">
                          {item.liveStreamStatus}
                        </Button>
                      ) : null}
                    </Td>
                  </Tr>
                ))}
            </Tbody>
          </Table>
        </div>
        {isApproveOpen && (
          <AlertDialog
            isOpen={isApproveOpen}
            leastDestructiveRef={cancelApproveRef}
            onClose={onApproveClose}
          >
            <AlertDialogOverlay>
              <AlertDialogContent>
                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                  Approve
                </AlertDialogHeader>
                <AlertDialogBody>
                  <div className="text-md pb-3">
                    Are you sure, Do you want to APPROVE ?
                  </div>
                </AlertDialogBody>
                <AlertDialogFooter>
                  <Button ref={cancelApproveRef} onClick={onApproveClose}>
                    Cancel
                  </Button>
                  <Button colorScheme="green" onClick={ApproveHandler} ml={3}>
                    Approve
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>
        )}
        {isRejectOpen && (
          <AlertDialog
            isOpen={isRejectOpen}
            leastDestructiveRef={cancelRejectRef}
            onClose={onRejectClose}
          >
            <AlertDialogOverlay>
              <AlertDialogContent>
                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                  Reject
                </AlertDialogHeader>
                <AlertDialogBody>
                  <div className="text-md pb-3">
                    Are you sure, Do you want to REJECT ?
                  </div>
                  <div className="font-semibold text-sm py-2">
                    Reason For Reject
                  </div>
                  {/* <Textarea
                    name="resonReject"
                    onChange={(e) => {
                      setReason(e.target.value);
                      seterrormessage(null);
                    }}
                    className="border border-graycolor w-36 bg-whitecolor focus-outline-none experience m-2"
                  /> */}
                  <select
                    name="resonReject"
                    // value={formik.values.name}
                    onChange={(e) => {
                      e.target.classList.add("change_color");
                      setReason(e.target.value);
                    }}
                    // onBlur={formik.handleBlur}
                    className={
                      "input-primary bg-whitecolor focus-outline-none experience"
                    }
                  >
                    <option name="resonReject" value="null">
                      Select
                    </option>
                    <option name="resonReject" value="Change Your Time">
                      Change Your Time
                    </option>
                    <option name="resonReject" value=" Change Your Date">
                      Change Your Date
                    </option>
                    <option name="resonReject" value="Call for Reason">
                      Call for Reason
                    </option>
                  </select>
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
                  <Button ref={cancelRejectRef} onClick={onRejectClose}>
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
        <Modal
          isOpen={isSupplierDetails}
          onClose={isSupplierDetailsClose}
          size="lg"
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Supplier Details</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <div className="p-4 ">
                <div className="border border-graycolor cursor-pointer">
                  <div className="grid grid-cols-6 px-4 px-1">
                    {/* <div className="col-span-3 text-blue-500 text-semibold border-r border-b border-graycolor p-1">
                      Supplier_Id
                    </div>
                    <div className="col-span-3 border-b p-1">
                      {details.secretName}
                    </div> */}
                    <div className="col-span-3 text-blue-500 text-semibold border-r border-b border-graycolor p-1">
                      Trade Name
                    </div>
                    <div className="col-span-3 border-b p-1">
                      {details.tradeName}
                    </div>
                    <div className="col-span-3 text-blue-500 text-semibold border-r border-b border-graycolor p-1">
                      Company Type
                    </div>
                    <div className="col-span-3 border-b p-1">
                      {details.companytype}
                    </div>
                    <div className="col-span-3 text-blue-500 text-semibold border-r border-b border-graycolor p-1">
                      Primary Contact Name
                    </div>
                    <div className="col-span-3 border-b p-1">
                      {details.primaryContactName}
                    </div>
                    <div className="col-span-3 text-blue-500 text-semibold border-r border-b border-graycolor p-1">
                      Primary Contact No
                    </div>
                    <div className="col-span-3 border-b p-1">
                      {details.primaryContactNumber}
                    </div>
                    {details.secondaryContactName == "" ? null : (
                      <>
                        <div className="col-span-3 text-blue-500 text-semibold border-r border-b border-graycolor p-1">
                          Secondary Contact Name
                        </div>
                        <div className="col-span-3 border-b p-1">
                          {details.secondaryContactName}
                        </div>
                      </>
                    )}
                    {details.secondaryConatactNumber == null ? null : (
                      <>
                        <div className="col-span-3 text-blue-500 text-semibold border-r border-b border-graycolor p-1">
                          Secondary Contact No
                        </div>
                        <div className="col-span-3 border-b p-1">
                          {details.secondaryConatactNumber}
                        </div>
                      </>
                    )}
                    <div className="col-span-3 text-blue-500 text-semibold border-r border-b border-graycolor p-1">
                      E-mail
                    </div>
                    <div className="col-span-3 border-b p-1">
                      {details.email}
                    </div>
                    <div className="col-span-3 text-blue-500 text-semibold border-r border-b border-graycolor p-1">
                      GST.No
                    </div>
                    <div className="col-span-3 border-b p-1">
                      {details.gstNo}
                    </div>
                    <div className="col-span-3 text-blue-500 text-semibold border-r border-b border-graycolor p-1">
                      Registered Address
                    </div>
                    <div className="col-span-3 border-b p-1">
                      {details.RegisteredAddress}
                    </div>
                    <div className="col-span-3 text-blue-500 text-semibold border-r border-b border-graycolor p-1">
                      Country
                    </div>
                    <div className="col-span-3 border-b p-1">
                      {details.countries}
                    </div>
                    <div className="col-span-3 text-blue-500 text-semibold border-r border-b border-graycolor p-1">
                      State
                    </div>
                    <div className="col-span-3 border-b p-1">
                      {details.state}
                    </div>
                    <div className="col-span-3 text-blue-500 text-semibold border-r border-b border-graycolor p-1">
                      Districk
                    </div>
                    <div className="col-span-3 border-b p-1">
                      {details.district}
                    </div>
                    <div className="col-span-3 text-blue-500 text-semibold border-r border-b border-graycolor p-1">
                      Pincode
                    </div>
                    <div className="col-span-3 border-b p-1">
                      {details.pinCode}
                    </div>
                    <div className="col-span-3 text-blue-500 text-semibold border-r border-b border-graycolor p-1">
                      Location
                    </div>
                    <div className="col-span-3 border-b p-1">
                      {details.gpsLocat}
                    </div>
                    <div className="col-span-3 text-blue-500 text-semibold border-r border-b border-graycolor p-1">
                      Product Dealing
                    </div>
                    <div className="col-span-3 border-b p-1">
                      {details.productDealingWith}
                    </div>
                    <div className="col-span-3 text-blue-500 text-semibold border-r border-b border-graycolor p-1">
                      Date Of Birth
                    </div>
                    <div className="col-span-3 border-b p-1">
                      {details.dateOfBirth}
                    </div>
                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button onClick={isSupplierDetailsClose} colorScheme="red" mr={3}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Modal
          isOpen={isProductDetails}
          onClose={isProductDetailsClose}
          size="sm"
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Product Details</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <div className="p-4 ">
                <div className="border border-graycolor cursor-pointer">
                  <div className="grid grid-cols-6 px-4 px-1">
                    <div className="col-span-3 text-blue-500 text-semibold border-r border-b border-graycolor p-1">
                      Product Name
                    </div>
                    <div className="col-span-3 border-b p-1">
                      {pdetails.product}
                    </div>
                    <div className="col-span-3 text-blue-500 text-semibold border-r border-b border-graycolor p-1">
                      Quentity
                    </div>
                    <div className="col-span-3 border-b p-1">
                      {pdetails.quantity}
                    </div>
                    <div className="col-span-3 text-blue-500 text-semibold border-r border-b border-graycolor p-1">
                      Proposed Quentity
                    </div>
                    <div className="col-span-3 border-b p-1">
                      {pdetails.proposedPrice}
                    </div>
                    <div className="col-span-3 text-blue-500 text-semibold border-r border-b border-graycolor p-1">
                      Proposed Price
                    </div>
                    <div className="col-span-3 border-b p-1">
                      {pdetails.proposedQuantity}
                    </div>
                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button onClick={isProductDetailsClose} colorScheme="red" mr={3}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </>
  );
};
export default VideoStreaming;
