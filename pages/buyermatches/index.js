/*
 *  Document    : BuyerMatches.js
 *  Author      : uyarchi
 *  Description : Buyer Matches from Search
 */
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as Yup from "yup";
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
  Input,
} from "@chakra-ui/react";

//components
import InputFields from "../controls/InputFields";
import axios from "../../axios";
import { Formik } from "formik";

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
const BuyerMatches = () => {
  //router
  const router = useRouter();
  // UseState
  const [buyerId, setBuyerId] = useState("");
  const [FromPrice, setFromPrice] = useState("null");
  const [ToPrice, setToPrice] = useState("null");
  const [FromQty, setFromQty] = useState("null");
  const [ToQty, setToQty] = useState("null");
  const [reload, setreload] = useState(false);
  const [statusname, setstatusname] = useState([]);
  const [productslist, setproductslist] = useState([]);
  const [distance, setdistance] = useState("");
  const [distancetonum, setdistancetonum] = useState("");
  const [totalprice, setTotalprice] = useState("");
  const [Details, setDetails] = useState("");
  useEffect(() => {
    axios
      .get("/v1/requirementCollection/thirdPartyApi/product")
      .then((res) => setproductslist(res.data));
  }, []);
  //Formik InitialValue
  const initialvalue = {
    callStatus: "",
    dateCallback: "",
    timeCallback: "",
  };
  //formik validation
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialvalue,
    validationSchema: Yup.object().shape({
      callStatus: Yup.string(),
      dateCallback: Yup.string(),
      timeCallback: Yup.string(),
    }),
  });
  //table
  const EmployeeTable = useTable();
  //get employees
  const fetchdata = async (page = 1) => {
    EmployeeTable.setLoading(true);
    const response = await axios.get(
      // `/v1/requirementCollection/supplier/productName/${Product}/${FromPrice}/${ToPrice}/${FromQty}/${ToQty}/null/${
      //   page - 1
      // }`
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
  // const Interested = (props) => {
  //   const data = {
  //     matchesstatus: "Interested",
  //   };
  //   axios.put(`/v1/requirementCollection/${props}`, data).then((res) => {
  //     console.log(res.data);
  //     setreload(!reload);
  //   });
  // };
  //usestate
  const [isSupplieropen, setIsSupplieropen] = useState(false);
  const isSupplierclose = () => {
    setIsSupplieropen(false);
  };
  const Matche = (props) => {
    setIsSupplieropen(true);
    setDetails(props);
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
    axios.get(`/v1/requirementCollectionBS/Buyer/${props}`).then((res) => {
      setBuyerData(res.data[0]);
      console.log(res.data[0]);
    });
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
      .get(`/v1/requirementCollectionBS/Buyer/SameProduct/all/${props}`)
      .then((res) => {
        setreload(!reload);
        setmatchesDetails(res.data);
        console.log(res.data);
      });

    //   //handle change for multiselect

    axios
      .get(`/v1/requirementCollectionBS/Buyer/${props}`)
      .then((res) => setBuyerData(res.data[0]));
  };
  //usestate
  let matchedSupplierDetails = [];
  const [matchedSupplier, setmatchedSupplier] = useState(false);
  const [matchedSupplierDetail, setmatchedSupplierDetails] = useState([]);
  matchedSupplierDetail.map((item) =>
    item.inte != "" ? matchedSupplierDetails.push(item) : null
  );
  console.log(matchedSupplierDetails);
  const matchesSupplierlistclose = () => {
    setmatchedSupplier(false);
    // setreload(!reload);
  };
  const matchedSupplierlist = (props) => {
    setmatchedSupplier(true);
    axios
      .get(`/v1/requirementCollectionBS/Buyer/SameProduct/all/${props}`)
      .then((res) => {
        setreload(!reload);
        setmatchedSupplierDetails(res.data);
        console.log(res.data);
      });
    //handle change for multiselect
    axios
      .get(`/v1/requirementCollectionBS/Buyer/${props}`)
      .then((res) => setBuyerData(res.data[0]));
  };
  //usestate
  const [iscallStatus, setIsCallStatus] = useState(false);
  //const [UpdatedDetails, setUpdatedDetails] = useState("");
  const IsCallStatusClose = () => {
    setIsCallStatus(false);
  };
  const IsCallStatus = () => {
    setIsCallStatus(true);
    // axios
    //   .get(`/v1/requirementCollectionBS/Buyer/UpdataData/${props}`)
    //   .then((res) => setUpdatedDetails(res.data));
  };
  const saveinterest = (props) => {
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
    var b = totime;
    b = b.replace(/\:/g, "");
    const time = parseInt(b);
    const data = {
      data: [props],
      BId: BuyerData._id,
      interestDate: today,
      interestTime: time,
    };
    axios.post("/v1/interestTable", data).then((res) => {
      matcheslist(buyerId);
      console.log(res.data);
    });
  };

  const saveCallStatus = () => {
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
    var b = totime;
    b = b.replace(/\:/g, "");
    const time = parseInt(b);
    let timeCall = formik.values.timeCallback;
    timeCall = timeCall.replace(/\:/g, "");
    const timeCallStatus = parseInt(timeCall);
    if (formik.values.callStatus === "rejected") {
      const data = {
        confirmCallStatus: formik.values.callStatus,
      };
      axios
        .delete(`/v1/requirementCollectionBS/Buyer/${buyerId}`, data)
        .then((res) => {
          //setreload(!reload);
          IsCallStatusClose;
        });
    }
    if (formik.values.callStatus != "rejected") {
      const data = {
        confirmCallStatus: formik.values.callStatus,
        confirmCallStatusDate: formik.values.dateCallback,
        confirmCallStatusTime: timeCallStatus,
      };
      axios
        .put(`/v1/requirementCollectionBS/Buyer/${buyerId}`, data)
        .then((res) => {
          setreload(!reload);
          IsCallStatusClose;
        });
    }
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
        <title>Supplier/Buyer App - Buyer Matches</title>
        <meta name="description" content="Generated by create next app" />
      </Head>
      <div className="p-4 ">
        <div className="w-full pb-4">
          <Breadcrumb separator=">">
            <Breadcrumb.Item href="/home">Home</Breadcrumb.Item>
            <Breadcrumb.Item>Buyer Matches</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr className="p-1"></hr>
        <div className="flex items-center pb-4">
          <span className="flex-auto text-sky-500 text-xl">Buyer Matches</span>
          <div className="flex items-center gap-3">
            <Button colorScheme="blue" onClick={() => router.reload()}>
              Refresh
            </Button>
          </div>
        </div>
        {/* <hr className="p-1"></hr>
        <div className="flex items-center gap-3 pb-4">
          <div className="flex-auto font-semibold text-primary"></div>
          <div className="flex">
            <select
              placeholder="Select"
              name="product"
              style={{ outline: 0 }}
              className="border border-graycolor w-24 focus-outline-none bg-whitecolor experience p-1"
              onChange={(e) => {
                EmployeeTable.setCurrentPage(1);
                e.target.classList.add("change_color");
                setProduct(e.target.value.toLowerCase());
              }}
            >
              <option value="null">Select</option>
              {productslist &&
                productslist.map((item, index) => (
                  <option key={index} value={item.productTitle}>
                    {item.productTitle}
                  </option>
                ))}
            </select>
            <span className="text-secondary">*</span>
          </div>
          <div className="flex">
            <InputFields
              type="number"
              placeholder="From Price"
              onChange={(e) => setFromPrice(e.target.value)}
              className="border border-graycolor px-2 w-24 "
            />
            <span className="text-secondary">*</span>
          </div>
          <div className="flex">
            <InputFields
              type="number"
              placeholder="To Price"
              onChange={(e) => setToPrice(e.target.value)}
              className="border border-graycolor px-2 w-24"
            />
            <span className="text-secondary">*</span>
          </div>
          <div className="flex">
            <InputFields
              type="number"
              placeholder="From Quantity"
              onChange={(e) => setFromQty(e.target.value)}
              className="border border-graycolor px-2 w-24"
            />
          </div>
          <div className="flex">
            <InputFields
              type="number"
              placeholder="To Quantity"
              onChange={(e) => setToQty(e.target.value)}
              className="border border-graycolor px-2 w-24"
            />
          </div>
          <div className="flex">
            <InputFields
              type="string"
              placeholder="Destination"
              onChange={(e) => {
                setDestination(e.target.value);
                setdistance("");
                setdistancetonum("");
              }}
              className="border border-graycolor px-2 w-24"
            />
          </div>
          {Product != "null" ? (
            FromPrice != "null" ? (
              ToPrice != "null" ? (
                <div className="flex text-center pr-2 gap-2">
                  <Button colorScheme="blue" onClick={handlesearch}>
                    Go
                  </Button>
                </div>
              ) : null
            ) : null
          ) : null}
        </div> */}

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
                  Requirement raised Date
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
                  Map View
                </Th>
                <Th textAlign="center" className="border">
                  delivered location
                </Th>
                <Th textAlign="center" className="border">
                  delivered date & time
                </Th>
                <Th textAlign="center" className="border">
                  No.of suppliers found matches
                </Th>
                <Th textAlign="center" className="border">
                  Status
                </Th>
                <Th textAlign="center" className="border">
                  Call Status
                </Th>
                <Th textAlign="center" className="border">
                  Action
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {EmployeeTable.rowData != "" ? null : (
                <Tr>
                  <Td
                    style={{ textAlign: "center" }}
                    className="font-semibold"
                    colSpan="15"
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
                      {item.interest ? (
                        <div>
                          <Button
                            size="xs"
                            variant={"link"}
                            colorScheme="blue"
                            onClick={() => {
                              setBuyerId(item._id);
                              matchedSupplierlist(item._id);
                            }}
                          >
                            {item.interest}
                          </Button>
                        </div>
                      ) : (
                        <div>0</div>
                      )}
                    </Td>
                    <Td textAlign="center">
                      {item.interest >= 1 ? (
                        <div>Matched</div>
                      ) : (
                        <div>Pending</div>
                      )}
                    </Td>
                    <Td textAlign="center">
                      {item.confirmCallStatus ? (
                        <div>{item.confirmCallStatus}</div>
                      ) : (
                        <div>Pending</div>
                      )}
                    </Td>
                    <Td textAlign="center">
                      {item.confirmCallStatus ? (
                        <Button
                          size="xs"
                          colorScheme="blue"
                          onClick={() => {
                            setBuyerId(item._id);
                            matcheslist(item._id);
                          }}
                          disabled
                        >
                          Matches
                        </Button>
                      ) : (
                        <Button
                          size="xs"
                          colorScheme="blue"
                          onClick={() => {
                            setBuyerId(item._id);
                            matcheslist(item._id);
                          }}
                        >
                          Matches
                        </Button>
                      )}
                      {/* <Button
                        size="xs"
                        colorScheme="blue"
                        onClick={() => {
                          setBuyerId(item._id);
                          matcheslist(item._id);
                        }}
                      >
                        Matches
                      </Button> */}
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
                          <Td className="w-32" textAlign="center">
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
        <Modal size="5xl" isOpen={matches} onClose={matcheslistclose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Matches Suppliers</ModalHeader>
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
                  <div className="flex flex-auto"></div>
                  <div>
                    {matchesDetails != "" ? (
                      <Button
                        size="sm"
                        colorScheme="blue"
                        onClick={() => IsCallStatus()}
                      >
                        call
                      </Button>
                    ) : (
                      <Button size="sm" colorScheme="blue" disabled>
                        call
                      </Button>
                    )}
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
                      <Th textAlign="center">Product Total Amount</Th>
                      <Th textAlign="center">Stock Location</Th>
                      <Th textAlign="center">Landing Price</Th>
                      <Th textAlign="center">Status</Th>
                      <Th textAlign="center">Action</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {matchesDetails != "" ? null : (
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
                    {matchesDetails &&
                      matchesDetails.map((item, index) => (
                        <Tr colSpan="2" key={index}>
                          <Td textAlign="center">{index + 1}</Td>
                          <Td textAlign="center" className="w-32">
                            {item.inte.map((itemA, indexA) => (
                              <div key={indexA}>
                                {itemA.interestDate}
                                {" / "}
                                {<Time data={itemA.interestTime} />}
                              </div>
                            ))}
                          </Td>
                          <Td textAlign="center">{item.secretName}</Td>
                          <Td textAlign="center">{item.expectedQnty}</Td>
                          <Td textAlign="center">{item.moderatedPrice}</Td>
                          <Td textAlign="center">
                            {item.expectedQnty * item.moderatedPrice}
                          </Td>
                          <Td textAlign="center">{item.stockLocation}</Td>
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
                            {item.inte.map((item, index) => (
                              <div key={index}>{item.interestStatus}</div>
                            ))}
                            {item.inte.length === 0 && <div>Pending</div>}
                          </Td>
                          <Td textAlign="center">
                            {item.inte.length === 0 ? (
                              formik.values.callStatus == "accepted" ? (
                                <Button
                                  size="xs"
                                  colorScheme="blue"
                                  onClick={() => {
                                    saveinterest(item.id);
                                  }}
                                >
                                  Interest
                                </Button>
                              ) : null
                            ) : (
                              <Button
                                disabled
                                size="xs"
                                colorScheme="blue"
                                onClick={() => {
                                  saveinterest(item.id);
                                }}
                              >
                                Interest
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
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Modal
          size="5xl"
          isOpen={matchedSupplier}
          onClose={matchesSupplierlistclose}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Matches Suppliers</ModalHeader>
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
                  <div className="flex flex-auto"></div>
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
                      <Th textAlign="center">Product Total Amount</Th>
                      <Th textAlign="center">Stock Location</Th>
                      <Th textAlign="center">Landing Price</Th>
                      <Th textAlign="center">Status</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {matchedSupplierDetails != "" ? null : (
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
                    {matchedSupplierDetails &&
                      matchedSupplierDetails.map((item, index) => (
                        <Tr colSpan="2" key={index}>
                          <Td textAlign="center">{index + 1}</Td>
                          <Td textAlign="center" className="w-32">
                            {item.inte.map((itemA, indexA) => (
                              <div key={indexA}>
                                {itemA.interestDate}
                                {" / "}
                                {<Time data={itemA.interestTime} />}
                              </div>
                            ))}
                          </Td>
                          <Td textAlign="center">{item.secretName}</Td>
                          <Td textAlign="center">{item.expectedQnty}</Td>
                          <Td textAlign="center">{item.moderatedPrice}</Td>
                          <Td textAlign="center">
                            {item.expectedQnty * item.moderatedPrice}
                          </Td>
                          <Td textAlign="center">{item.stockLocation}</Td>
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
                            {item.inte.map((item, index) => (
                              <div key={index}>{item.interestStatus}</div>
                            ))}
                            {item.inte.length === 0 && <div>Pending</div>}
                          </Td>
                        </Tr>
                      ))}
                  </Tbody>
                </Table>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                onClick={matchesSupplierlistclose}
                colorScheme="blue"
                mr={3}
              >
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Modal isOpen={iscallStatus} onClose={IsCallStatusClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Call Status</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <div className="grid pb-2 gap-2">
                {/* <label className="font-semibold">Status :</label> */}
                <select
                  name="status"
                  onChange={(e) => {
                    formik.setFieldValue("callStatus", e.target.value);
                    e.target.classList.add("change_color");
                  }}
                  onBlur={formik.handleBlur}
                  style={{ outline: 0 }}
                  className="input-primary"
                >
                  <option value="null">Select Call Status</option>
                  <option value="accepted">Accepted</option>
                  <option value="callback">CallBack</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              {formik.values.callStatus === "callback" ? (
                <>
                  <div className="grid pb-2 gap-2">
                    <Input
                      type="date"
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
                  </div>
                  <div className="grid pb-2 gap-2">
                    <Input
                      type="time"
                      name="timeCallback"
                      placeholder="Enter Price"
                      value={formik.values.timeCallback || ""}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={
                        formik.touched.timeCallback &&
                        formik.errors.timeCallback
                          ? "input-primary bg-whitecolor focus-outline-none ring-2 ring-secondary border-none experience"
                          : "input-primary bg-whitecolor focus-outline-none experience"
                      }
                    />
                  </div>
                </>
              ) : null}
            </ModalBody>
            <ModalFooter>
              <Button onClick={IsCallStatusClose} colorScheme="blue" mr={3}>
                Close
              </Button>
              <Button
                //onClick={matcheslistclose}
                colorScheme="blue"
                onClick={() => {
                  saveCallStatus();
                  IsCallStatusClose();
                }}
              >
                save
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </>
  );
};
export default BuyerMatches;
