/*
 *  Document    : BuyerMatches.js
 *  Author      : uyarchi
 *  Description : Buyer Matches from Search
 */
import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/router";
import Head from "next/head";
import { Breadcrumb } from "antd";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
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
  useDisclosure,
} from "@chakra-ui/react";

//components
import InputFields from "../controls/InputFields";
import Forms from "../controls/Forms";
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
//data for vehicle
const data = [
  {
    vname: "TATA ACE",
    capacity: "850 kgs",
    amount: 10,
  },
  {
    vname: "ASHOK LEYLAND DOST",
    capacity: "1 Ton",
    amount: 20,
  },
  {
    vname: "MAHINDRA BOLERO",
    capacity: "1.5 Ton",
    amount: 30,
  },
  {
    vname: "TATA 407",
    capacity: "2.5 Ton",
    amount: 40,
  },
  {
    vname: "EICHER 14 FEET",
    capacity: "4 Ton",
    amount: 50,
  },
  {
    vname: "EICHER 17 FEET",
    capacity: "5 Ton",
    amount: 60,
  },
];
//function init
const ShortlistOrder = () => {
  //router
  const router = useRouter();
  // UseState
  const [reload, setreload] = useState(false);
  const [BuyerId, setBuyerId] = useState("");
  const [productslist, setproductslist] = useState([]);
  const [distance, setdistance] = useState("");
  const [distancetonum, setdistancetonum] = useState("");
  const [totalprice, setTotalprice] = useState("");
  const [Details, setDetails] = useState("");
  const [id, setId] = useState("");
  useEffect(() => {
    axios
      .get("/v1/requirementCollection/thirdPartyApi/product")
      .then((res) => setproductslist(res.data));
  }, []);
  //Formik InitialValue
  const initialvalue = {
    callstatus: "",
    shortlistQuantity: "",
  };
  //formik validation
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialvalue,
    validationSchema: Yup.object().shape({
      callstatus: Yup.string(),
      shortlistQuantity: Yup.string(),
    }),
  });
  //table
  const EmployeeTable = useTable();
  //get employees
  const fetchdata = async (page = 1) => {
    EmployeeTable.setLoading(true);
    const response = await axios.get(
      "/v1/requirementCollectionBS/Buyer/Live/all"
    );
    if (response.status === 200 && response.data) {
      EmployeeTable.setRowData(response.data);
      console.log(response.data);
    } else {
      EmployeeTable.setRowData([]);
    }
  };
  useEffect(() => {
    fetchdata(EmployeeTable.currentPage, EmployeeTable.showLimit);
  }, [reload, EmployeeTable.currentPage, EmployeeTable.showLimit]);

  // Search Method
  const handlesearch = () => {
    EmployeeTable.setCurrentPage(1);
    fetchdata(EmployeeTable.currentPage, EmployeeTable.showLimit);
  };
  //usestate
  const [isvehicle, setisvehicle] = useState(false);
  const isvehicleclose = () => {
    setisvehicle(false);
  };
  const vehicleopen = (props) => {
    console.log(props);
    setTotalprice(
      props.expectedQnty * props.moderatedPrice + props.expectedQnty * 5
    );
    //let a = props.expquantity * props.editedPrice + props.expquantity * 5
    console.log(props.stockLocation);
    setisvehicle(true);
    const key = "AIzaSyDoYhbYhtl9HpilAZSy8F_JHmzvwVDoeHI";
    axios
      .get(
        `/v1/requirementCollection/thirdPartyApi/googleMap/${BuyerData.deliverylocation}/${props.stockLocation}/${key}`
      )
      .then((res) => {
        console.log(res.data);
        console.log(res.data.rows[0].elements[0].distance.text);
        setdistance(res.data.rows[0].elements[0].distance.text);
        // if(res.data.rows[0].elements[0].distance.text )
        const myArray = res.data.rows[0].elements[0].distance.text.split(" ");
        console.log(myArray[0]);
        setdistancetonum(myArray[0]);
      });
  };

  //usestate
  const [isSupplierCall, setIsSupplierCall] = useState(false);
  const isSupplierclose = () => {
    setIsSupplierCall(false);
  };
  const Call = (props) => {
    setIsSupplierCall(true);
    setDetails(props);
  };
  //usestate
  const [isSupplierDetails, setIsSupplierDetails] = useState(false);
  const [isSupplierData, setIsSupplierData] = useState("");
  const isSupplierDetailsclose = () => {
    setIsSupplierDetails(false);
  };
  const supplierData = (props) => {
    setIsSupplierDetails(true);
    axios
      .get(`/v1/requirementCollectionBS/Supplier/${props}`)
      .then((res) => setIsSupplierData(res.data[0]));
  };
  //usestate
  const [isBuyerDetails, setBuyerDetails] = useState(false);
  const [BuyerData, setBuyerData] = useState("");
  const [SupplierData, setSupplierData] = useState("");

  const isBuyerDetailsClose = () => {
    setBuyerDetails(false);
  };
  const Buyer = (props) => {
    setBuyerDetails(true);
    axios
      .get(`/v1/requirementCollectionBS/Buyer/${props}`)
      .then((res) => setBuyerData(res.data[0]));
  };
  // //usestate
  // const [islastTimeUpdatedQtyRange, setLastTimeUpdatedQtyRange] =
  //   useState(false);
  // const [UpdatedDetails, setUpdatedDetails] = useState([]);
  // let UpdateQty = [];
  // let UpdatePrice = [];
  // let UpdateLocation = [];
  // UpdatedDetails.map((item) =>
  //   item.QtyMin && item.QtyMax ? UpdateQty.push(item) : null
  // );
  // UpdatedDetails.map((item) =>
  //   item.priceMin && item.priceMax ? UpdatePrice.push(item) : null
  // );
  // UpdatedDetails.map((item) =>
  //   item.deliveryLocation ? UpdateLocation.push(item) : null
  // );
  // const isLastTimeUpdatedQtyRangeClose = () => {
  //   setLastTimeUpdatedQtyRange(false);
  // };
  // const UpdatedQtyRangeList = (props) => {
  //   setLastTimeUpdatedQtyRange(true);
  //   axios
  //     .get(`/v1/requirementCollectionBS/Buyer/UpdataData/${props}`)
  //     .then((res) => setUpdatedDetails(res.data));
  // };
  // //usestate
  // const [islastTimeUpdatedPriceRange, setLastTimeUpdatedPriceRange] =
  //   useState(false);
  // //const [UpdatedDetails, setUpdatedDetails] = useState("");
  // const isLastTimeUpdatedPriceRangeClose = () => {
  //   setLastTimeUpdatedPriceRange(false);
  // };
  // const UpdatedPriceRangeList = (props) => {
  //   setLastTimeUpdatedPriceRange(true);
  //   axios
  //     .get(`/v1/requirementCollectionBS/Buyer/UpdataData/${props}`)
  //     .then((res) => setUpdatedDetails(res.data));
  // };
  // //usestate
  // const [islastTimeUpdatedLocation, setLastTimeUpdatedLocation] =
  //   useState(false);
  // //const [UpdatedDetails, setUpdatedDetails] = useState("");
  // const isLastTimeUpdatedLocationClose = () => {
  //   setLastTimeUpdatedLocation(false);
  // };
  // const UpdatedLocationList = (props) => {
  //   setLastTimeUpdatedLocation(true);
  //   axios
  //     .get(`/v1/requirementCollectionBS/Buyer/UpdataData/${props}`)
  //     .then((res) => setUpdatedDetails(res.data));
  // };
  //modal for map
  const [slat, setslat] = useState("");
  const [slng, setslng] = useState("");
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

  //usestate
  const [matches, setmatches] = useState(false);
  const [matchesDetails, setmatchesDetails] = useState([]);
  const matcheslistclose = () => {
    setmatches(false);
    // setreload(!reload);
  };
  const matcheslist = (props) => {
    setmatches(true);
    axios
      .get(`/v1/requirementCollectionBS/Buyer/sameProduct/short/all/${props}`)
      .then((res) => {
        setreload(!reload);
        setmatchesDetails(res.data);
        console.log(res.data);
      });

    //handle change for multiselect

    axios
      .get(`/v1/requirementCollectionBS/Buyer/${props}`)
      .then((res) => setBuyerData(res.data[0]));
  };
  //usestate
  let shortlistData = [];
  const [shortlistSupplier, setShortlistSupplier] = useState(false);
  const [ShortlistDetails, setShortlistDetails] = useState([]);
  ShortlistDetails.map((item, index) =>
    item.shortliststatus == "shortlist" ? shortlistData.push(item) : null
  );
  const shortlistSupplierClose = () => {
    setShortlistSupplier(false);
    // setreload(!reload);
  };
  const shortlist = (props) => {
    setShortlistSupplier(true);
    axios
      .get(`/v1/requirementCollectionBS/Buyer/sameProduct/short/all/${props}`)
      .then((res) => {
        setreload(!reload);
        setShortlistDetails(res.data);
        console.log(res.data);
      });

    //handle change for multiselect

    axios
      .get(`/v1/requirementCollectionBS/Buyer/${props}`)
      .then((res) => setBuyerData(res.data[0]));
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
    let status;
    if (values.callstatus == "accepted") {
      status = "shortlist";
    }
    if (values.callstatus == "callback") {
      status = "pending";
    }
    if (values.callstatus == "rejected") {
      status = "rejected";
    }
    const data = {
      shortlistStatus: status,
      shortStatus: values.callstatus,
      shortlistQuantity: values.shortlistQuantity,
      shortDate: today,
      shortTime: time,
    };
    console.log(data);
    axios
      .put(`/v1/interestTable/${id}`, data)
      .then((res) => {
        console.log(res.data);
        matcheslist(BuyerId);
        setIsSupplierCall(false);
        // formik.resetForm();
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          //seterrorMessage(error.response.data.message);
        }
      });
    console.log(data);
  };
  const Time = (props) => {
    const a = props.data;
    console.log(a);
    const first2Str = String(a).slice(0, 2); // 👉️ '13'
    const second2Str = String(a).slice(2, 4); // 👉️ '13'
    const final = first2Str + ":" + second2Str;
    return <>{final}</>;
  };
  return (
    <>
      <Head>
        <title>Supplier/Buyer App - Shortlisted Order</title>
        <meta name="description" content="Generated by create next app" />
      </Head>
      <div className="p-4 ">
        <div className="w-full pb-4">
          <Breadcrumb separator=">">
            <Breadcrumb.Item href="/home">Home</Breadcrumb.Item>
            <Breadcrumb.Item>Shortlisted Order</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr className="p-1"></hr>
        <div className="flex items-center pb-4">
          <span className="flex-auto text-sky-500 text-xl">
            Shortlisted Order
          </span>
          <div className="flex items-center gap-3">
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
                <Th textAlign="center" className="border">
                  S.No
                </Th>
                <Th textAlign="center" className="border">
                  Date / Time
                </Th>
                <Th textAlign="center" className="border">
                  registered by whom
                </Th>
                <Th textAlign="center" className="border">
                  requirement id
                </Th>
                <Th textAlign="center" className="border">
                  name
                </Th>
                <Th textAlign="center" className="border">
                  product
                </Th>
                <Th textAlign="center" className="border">
                  qty range
                </Th>
                <Th textAlign="center" className="border">
                  price range
                </Th>
                <Th textAlign="center" className="border">
                  No.of suppliers Interested
                </Th>
                <Th textAlign="center" className="border">
                  Count of confirmed suppliers
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {EmployeeTable.rowData != "" ? null : (
                <Tr>
                  <Td
                    style={{ textAlign: "center" }}
                    className="font-semibold"
                    colSpan="10"
                  >
                    No Data Found
                  </Td>
                </Tr>
              )}
              {EmployeeTable.rowData &&
                EmployeeTable.rowData.map((item, index) => (
                  <Tr key={index}>
                    <Td textAlign="center">
                      {index +
                        10 * (parseInt(EmployeeTable.currentPage) - 1) +
                        1}
                    </Td>
                    <Td textAlign="center" className="w-32">
                      {item.date}
                      {" / "}
                      {<Time data={item.time} />}
                    </Td>
                    <Td textAlign="center">{item.requirementAddBy}</Td>
                    <Td textAlign="center">{item.secretName}</Td>
                    <Td textAlign="center">
                      <Button
                        size="md"
                        colorScheme="blue"
                        variant="link"
                        onClick={() => Buyer(item._id)}
                      >
                        {item.name}
                      </Button>
                    </Td>
                    <Td textAlign="center">{item.product}</Td>
                    <Td textAlign="center">
                      {item.minrange}
                      {" - "}
                      {item.maxrange}
                    </Td>
                    <Td textAlign="center">
                      {item.minprice}
                      {" - "}
                      {item.maxprice}
                    </Td>
                    <Td textAlign="center">
                      {item.interest > 0 ? (
                        <Button
                          size="md"
                          colorScheme="blue"
                          variant="link"
                          onClick={() => {
                            matcheslist(item._id);
                            setBuyerId(item._id);
                          }}
                        >
                          {item.interest}
                        </Button>
                      ) : (
                        <Button size="md" colorScheme="blue" variant="link">
                          {item.interest}
                        </Button>
                      )}
                    </Td>
                    <Td textAlign="center">
                      <Button
                        size="md"
                        colorScheme="blue"
                        variant="link"
                        onClick={() => {
                          shortlist(item._id);
                          setBuyerId(item._id);
                        }}
                      >
                        {item.shortlist}
                      </Button>
                    </Td>
                  </Tr>
                ))}
            </Tbody>
          </Table>
        </div>

        <Modal isOpen={isBuyerDetails} onClose={isBuyerDetailsClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Buyer Details</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <div className="p-4">
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
                                  ? BuyerData.deadFeedback == ""
                                    ? "null"
                                    : BuyerData.deadFeedback
                                  : null}
                                {BuyerData.statusAccept ==
                                "Requirement Alive with modification"
                                  ? BuyerData.modificationFeedback == ""
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
        <Modal
          isOpen={isSupplierDetails}
          onClose={isSupplierDetailsclose}
          size="xl"
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Supplier Details</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <div className="p-4 ">
                <div className="border border-graycolor cursor-pointer">
                  <div className="grid grid-cols-6 px-4 px-1">
                    <div className="col-span-2 text-blue-500 text-semibold border-r border-b border-graycolor p-1">
                      Product Name
                    </div>
                    <div className="col-span-4 border-b p-1">
                      {isSupplierData.product}
                    </div>
                    <div className="col-span-2 text-blue-500 text-semibold border-r border-b border-graycolor p-1">
                      Stock Location
                    </div>
                    <div className="col-span-4 border-b p-1">
                      {isSupplierData.stockLocation}
                    </div>
                    <div className="col-span-2 text-blue-500 text-semibold border-r border-b border-graycolor p-1">
                      Stock position
                    </div>
                    <div className="col-span-4 border-b p-1">
                      {isSupplierData.stockPosition}
                    </div>
                    {isSupplierData.stockPosition == "ready" ? (
                      <>
                        <div className="col-span-2 text-blue-500 text-semibold border-r border-b border-graycolor p-1">
                          Pack Type
                        </div>
                        <div className="col-span-4 border-b p-1">
                          {isSupplierData.packType}
                        </div>
                        <div className="col-span-2 text-blue-500 text-semibold border-r border-b border-graycolor p-1">
                          Excepted Quantity
                        </div>
                        <div className="col-span-4 border-b p-1">
                          {isSupplierData.expectedQnty}
                        </div>
                        <div className="col-span-2 text-blue-500 text-semibold border-r border-b border-graycolor p-1">
                          Excepted Price
                        </div>
                        <div className="col-span-4 border-b p-1">
                          {isSupplierData.expectedPrice}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="col-span-2 text-blue-500 text-semibold border-r border-b border-graycolor p-1">
                          Stock Availability Date
                        </div>
                        <div className="col-span-4 border-b p-1">
                          {isSupplierData.stockAvailabilityDate}
                        </div>
                        <div className="col-span-2 text-blue-500 text-semibold border-r border-b border-graycolor p-1">
                          Stock Availability Time
                        </div>
                        <div className="col-span-4 border-b p-1">
                          {isSupplierData.stockAvailabilityTime}
                        </div>
                      </>
                    )}
                    <div className="col-span-2 text-blue-500 text-semibold border-r border-b border-graycolor p-1">
                      Payment Mode
                    </div>
                    <div className="col-span-4 border-b p-1">
                      {isSupplierData.paymentMode}
                    </div>
                    {isSupplierData.paymentMode == "advance" ? (
                      <>
                        <div className="col-span-2 text-blue-500 text-semibold border-r border-graycolor p-1">
                          Advance
                        </div>
                        <div className="col-span-4 p-1">
                          {isSupplierData.advance}
                        </div>
                      </>
                    ) : null}
                    {isSupplierData.status ? (
                      <>
                        <div className="col-span-2 text-blue-500 text-semibold border-r border-b border-graycolor p-1">
                          Status
                        </div>
                        <div className="col-span-4 border-b p-1">
                          {isSupplierData.status}
                        </div>
                        {isSupplierData.status == "Accepted" ? (
                          <>
                            <div className="col-span-2 text-blue-500 text-semibold border-r border-b border-graycolor p-1">
                              Accepted Reason
                            </div>
                            <div className="col-span-4 border-b p-1">
                              {isSupplierData.statusAccept}
                            </div>
                            <div className="col-span-2 text-blue-500 text-semibold border-r border-b border-graycolor p-1">
                              FeedBack
                            </div>
                            <div className="col-span-4 border-b p-1">
                              {isSupplierData.statusAccept ==
                              "Requirement Alive"
                                ? isSupplierData.aliveFeedback != ""
                                  ? isSupplierData.aliveFeedback
                                  : "null"
                                : null}
                              {isSupplierData.statusAccept == "Requirement dead"
                                ? isSupplierData.deadFeedback != ""
                                  ? isSupplierData.deadFeedback
                                  : "null"
                                : null}
                              {isSupplierData.statusAccept ==
                              "Requirement Alive with modification"
                                ? isSupplierData.modificationFeedback != ""
                                  ? isSupplierData.modificationFeedback
                                  : "null"
                                : null}
                            </div>
                          </>
                        ) : null}
                        {isSupplierData.status == "CallBack" ? (
                          <>
                            <div className="col-span-2 text-blue-500 text-semibold border-r border-b border-graycolor p-1">
                              Callback Reason
                            </div>
                            <div className="col-span-4 border-b p-1">
                              {isSupplierData.reasonCallback}
                            </div>
                            {isSupplierData.reasonCallback ==
                            "Answer to call later" ? (
                              <>
                                <div className="col-span-2 text-blue-500 text-semibold border-r border-b border-graycolor p-1">
                                  Back to Call
                                </div>
                                <div className="col-span-4 border-b p-1">
                                  {isSupplierData.dateCallback.split("T")[0]}
                                </div>
                              </>
                            ) : null}
                            <div className="col-span-2 text-blue-500 text-semibold border-r border-b border-graycolor p-1">
                              FeedBack
                            </div>
                            <div className="col-span-4 border-b p-1">
                              {isSupplierData.feedbackCallback == ""
                                ? "null"
                                : isSupplierData.feedbackCallback}
                            </div>
                          </>
                        ) : null}
                      </>
                    ) : null}
                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button onClick={isSupplierDetailsclose} colorScheme="red" mr={3}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Modal isOpen={isvehicle} onClose={isvehicleclose} size="2xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Vehicle Chosen</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {/* {distance != "" ? ( */}
              <div className="py-2 flex">
                <div className="px-1 font-semibold">Total Kilometers -</div>
                <div>{distancetonum}</div>
              </div>
              {/* // ) : null} */}
              {distancetonum && (
                <div className="border-gray-500 scroll-smooth border pb-5 overflow-y-scroll">
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
                        <Th>Vehicle Name</Th>
                        <Th>Capacity</Th>
                        <Th>Amount Per km</Th>
                        <Th>vehicle Amount</Th>
                        <Th>Total Amount</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {data &&
                        data.map((item, index) => (
                          <Tr key={index}>
                            <Td>{index + 1}</Td>
                            <Td>{item.vname}</Td>
                            <Td>{item.capacity}</Td>
                            <Td>{item.amount}</Td>
                            <Td>{distancetonum * item.amount}</Td>
                            <Td>
                              {parseInt(
                                totalprice + distancetonum * item.amount
                              )}
                            </Td>
                            <Td></Td>
                          </Tr>
                        ))}
                    </Tbody>
                  </Table>
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              <Button onClick={isvehicleclose} colorScheme="blue" mr={3}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        {/* <Modal
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
                      <Th>S.No</Th>
                      <Th>Date</Th>
                      <Th>Time</Th>
                      <Th>Changed Qty Range</Th>
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
                    {UpdateQty &&
                      UpdateQty.map((item, index) => (
                        <Tr colSpan="2" key={index}>
                          <Td>{index + 1}</Td>
                          <Td>{item.date}</Td>
                          <Td>{item.time}</Td>
                          <Td>
                            {item.QtyMin}-{item.QtyMax}
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
                      <Th>S.No</Th>
                      <Th>Date</Th>
                      <Th>Time</Th>
                      <Th>Changed Price</Th>
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
                          <Td>{index + 1}</Td>
                          <Td>{item.date}</Td>
                          <Td>{item.time}</Td>
                          <Td>
                            {item.priceMin}-{item.priceMax}
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
                      <Th>S.No</Th>
                      <Th>Date</Th>
                      <Th>Time</Th>
                      <Th>Location</Th>
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
                    {UpdateLocation &&
                      UpdateLocation.map((item, index) => (
                        <Tr colSpan="2" key={index}>
                          <Td>{index + 1}</Td>
                          <Td>{item.date}</Td>
                          <Td>{item.time}</Td>
                          <Td>{item.deliveryLocation}</Td>
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
        </Modal> */}
        <Modal isOpen={isSupplierCall} onClose={isSupplierclose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Call Status</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Forms>
                <div className="grid items-center gap-2">
                  <div className="grid pb-2 gap-2">
                    <label className="font-semibold">Status :</label>
                    <select
                      name="status"
                      onChange={(e) => {
                        formik.setFieldValue("callstatus", e.target.value);
                        e.target.classList.add("change_color");
                      }}
                      onBlur={formik.handleBlur}
                      style={{ outline: 0 }}
                      className="input-primary"
                    >
                      <option value="null">Select Status</option>
                      <option value="accepted">Accepted</option>
                      <option value="callback">CallBack</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                  <div className="flex flex-row gap-2">
                    <label className="font-semibold ">Buyer Qty Range :</label>
                    {BuyerData.minrange}-{BuyerData.maxrange}
                  </div>
                  <div className="flex flex-row gap-2">
                    <label className="font-semibold ">
                      Available Quantity :
                    </label>
                    {Details.expectedQnty}
                  </div>
                  <div className="grid pb-2 gap-2">
                    <label className="font-semibold ">
                      Shortlisted Quantity
                    </label>
                    <InputFields
                      type="string"
                      name="shortlistQuantity"
                      placeholder="Enter Shortlisted Quantity"
                      value={formik.values.shortlistQuantity || ""}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="input-primary"
                    />
                    {/* {formik.touched.advance && formik.errors.advance ? (
                      <FormikErrorMessage>
                        {formik.errors.advance}
                      </FormikErrorMessage>
                    ) : null} */}
                  </div>
                </div>
              </Forms>
            </ModalBody>
            <ModalFooter>
              <Button onClick={isSupplierclose} colorScheme="blue" mr={3}>
                Close
              </Button>
              <Button
                onClick={UpdatedSupplierCallStatus}
                colorScheme="blue"
                mr={3}
              >
                Save
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Modal size="5xl" isOpen={matches} onClose={matcheslistclose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Shortlist Suppliers</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <div className="space-y-3">
                <div className="flex flex-row gap-2">
                  <div>{BuyerData.secretName}</div>
                  <div>
                    <label className="font-semibold">Name:</label>{" "}
                    {BuyerData.name}
                  </div>
                  <div>
                    <label className="font-semibold">Mobile No:</label>{" "}
                    {BuyerData.mobileNumber}
                  </div>
                </div>
                <div className="flex flex-row gap-2">
                  <div>
                    <label className="font-semibold">Price:</label>{" "}
                    {BuyerData.product}
                  </div>
                  <div>
                    <label className="font-semibold">Quantity:</label>{" "}
                    {BuyerData.minrange}-{BuyerData.maxrange}
                  </div>
                  <div>
                    <label className="font-semibold"> Price: </label>{" "}
                    {BuyerData.minprice}-{BuyerData.maxprice}
                  </div>
                  <div>
                    <label className="font-semibold"> Location: </label>{" "}
                    {BuyerData.deliverylocation}
                  </div>
                </div>
              </div>
              <div className="border-gray-500 scroll-smooth border mt-3">
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
                      <Th textAlign="center">Date / Time</Th>
                      <Th textAlign="center">Supplier Name</Th>
                      <Th textAlign="center">Available Quantity</Th>
                      <Th textAlign="center">Moderate Price</Th>
                      <Th textAlign="center">Landing price</Th>
                      <Th textAlign="center">confirmed order qty</Th>
                      <Th textAlign="center">Status</Th>
                      <Th textAlign="center">Call Status</Th>
                      <Th textAlign="center">Call Action</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {matchesDetails != "" ? null : (
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
                    {matchesDetails &&
                      matchesDetails.map((item, index) => (
                        <Tr colSpan="2" key={index}>
                          <Td textAlign="center">{index + 1}</Td>
                          <Td textAlign="center">
                            {item.shortDate ? (
                              <div className="w-32">
                                {item.shortDate}
                                {" / "}
                                {<Time data={item.shortTime} />}
                              </div>
                            ) : null}
                          </Td>
                          <Td textAlign="center">
                            <Button
                              variant="link"
                              size="xs"
                              colorScheme="blue"
                              onClick={() => supplierData(item.id)}
                            >
                              {item.secretName}
                            </Button>
                          </Td>
                          <Td textAlign="center">{item.expectedQnty}</Td>
                          <Td textAlign="center">{item.moderatedPrice}</Td>
                          <Td textAlign="center">
                            <Button
                              variant="link"
                              size="xs"
                              colorScheme="blue"
                              onClick={() => vehicleopen(item)}
                            >
                              VIEW
                            </Button>
                          </Td>
                          <Td textAlign="center">
                            {item.shortlistQuantity ? (
                              <div>{item.shortlistQuantity}</div>
                            ) : (
                              <div>0</div>
                            )}
                          </Td>
                          <Td textAlign="center">
                            {item.shortliststatus === "shortlist" ? (
                              <div>{item.shortliststatus}</div>
                            ) : (
                              <div>Pending</div>
                            )}
                          </Td>
                          <Td textAlign="center">
                            {item.shortStatus ? (
                              <div>{item.shortStatus}</div>
                            ) : (
                              <div>pending</div>
                            )}
                          </Td>
                          <Td textAlign="center">
                            {item.shortliststatus === "shortlist" ? (
                              <Button size="xs" colorScheme="blue" disabled>
                                Call
                              </Button>
                            ) : (
                              <Button
                                size="xs"
                                colorScheme="blue"
                                onClick={() => {
                                  Call(item);
                                  setId(item.interestId);
                                }}
                              >
                                Call
                              </Button>
                            )}
                          </Td>
                        </Tr>
                      ))}
                  </Tbody>
                </Table>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button onClick={matcheslistclose} colorScheme="blue" mr={3}>
                Close
              </Button>
              {/* <Button
                //onClick={matcheslistclose}
                colorScheme="blue"
                // onClick={() => {
                //   saveinterest();
                // }}
              >
                save
              </Button> */}
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Modal
          size="5xl"
          isOpen={shortlistSupplier}
          onClose={shortlistSupplierClose}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Shortlist Suppliers</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <div className="space-y-3">
                <div className="flex flex-row gap-2">
                  <div>{BuyerData.secretName}</div>
                  <div>
                    <label className="font-semibold">Name:</label>{" "}
                    {BuyerData.name}
                  </div>
                  <div>
                    <label className="font-semibold">Mobile No:</label>{" "}
                    {BuyerData.mobileNumber}
                  </div>
                </div>
                <div className="flex flex-row gap-2">
                  <div>
                    <label className="font-semibold">Price:</label>{" "}
                    {BuyerData.product}
                  </div>
                  <div>
                    <label className="font-semibold">Quantity:</label>{" "}
                    {BuyerData.minrange}-{BuyerData.maxrange}
                  </div>
                  <div>
                    <label className="font-semibold"> Price: </label>{" "}
                    {BuyerData.minprice}-{BuyerData.maxprice}
                  </div>
                  <div>
                    <label className="font-semibold"> Location: </label>{" "}
                    {BuyerData.deliverylocation}
                  </div>
                </div>
              </div>
              <div className="border-gray-500 scroll-smooth border mt-3">
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
                      <Th textAlign="center">Date / Time</Th>
                      <Th textAlign="center">Supplier Name</Th>
                      <Th textAlign="center">Available Quantity</Th>
                      <Th textAlign="center">Moderate Price</Th>
                      <Th textAlign="center">Landing price</Th>
                      <Th textAlign="center">confirmed order qty</Th>
                      <Th textAlign="center">Status</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {shortlistData != "" ? null : (
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
                    {shortlistData &&
                      shortlistData.map((item, index) => (
                        <Tr colSpan="2" key={index}>
                          <Td textAlign="center">{index + 1}</Td>
                          <Td textAlign="center">
                            {item.shortDate ? (
                              <div className="w-32">
                                {item.shortDate}
                                {" / "}
                                {<Time data={item.shortTime} />}
                              </div>
                            ) : null}
                          </Td>
                          <Td textAlign="center">
                            <Button
                              variant="link"
                              size="xs"
                              colorScheme="blue"
                              onClick={() => supplierData(item.id)}
                            >
                              {item.secretName}
                            </Button>
                          </Td>
                          <Td textAlign="center">{item.expectedQnty}</Td>
                          <Td textAlign="center">{item.moderatedPrice}</Td>
                          <Td textAlign="center">
                            <Button
                              variant="link"
                              size="xs"
                              colorScheme="blue"
                              onClick={() => vehicleopen(item)}
                            >
                              VIEW
                            </Button>
                          </Td>
                          <Td textAlign="center">
                            {item.shortlistQuantity ? (
                              <div>{item.shortlistQuantity}</div>
                            ) : (
                              <div>0</div>
                            )}
                          </Td>
                          <Td textAlign="center">
                            {item.shortliststatus === "shortlist" ? (
                              <div>{item.shortliststatus}</div>
                            ) : (
                              <div>Pending</div>
                            )}
                          </Td>
                        </Tr>
                      ))}
                  </Tbody>
                </Table>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                onClick={shortlistSupplierClose}
                colorScheme="blue"
                mr={3}
              >
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </>
  );
};
export default ShortlistOrder;
