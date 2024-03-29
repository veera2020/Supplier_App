/*
 *  Document    : index.js
 *  Author      : uyarchi
 *  Description : Fixed Order
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
  Input,
  ButtonGroup,
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
const FixedOrder = () => {
  //router
  const router = useRouter();
  // UseState

  const [reload, setreload] = useState(false);
  const [buyerId, setBuyerId] = useState("");
  const [productslist, setproductslist] = useState([]);
  const [distance, setdistance] = useState("");
  const [distancetonum, setdistancetonum] = useState("");
  const [totalprice, setTotalprice] = useState("");
  const [Details, setDetails] = useState("");
  const [FixedId, setFixedId] = useState("");
  useEffect(() => {
    axios
      .get("/v1/requirementCollection/thirdPartyApi/product")
      .then((res) => setproductslist(res.data));
  }, []);
  //Formik InitialValue
  const initialvalue = {
    callStatus: "",
    buyerFixedQty: "",
    totalPrice: "",
    dateCallback: "",
    timeCallback: "",
  };
  //formik validation
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialvalue,
    validationSchema: Yup.object().shape({
      callStatus: Yup.string(),
      buyerFixedQty: Yup.string(),
      totalPrice: Yup.string(),
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
    axios
      .get(`/v1/requirementCollectionBS/Buyer/${props}`)
      .then((res) => setBuyerData(res.data[0]));
  };
  //usestate
  const [fixed, setfixed] = useState(false);
  const [fixedd, setfixedd] = useState([]);
  const fixedclose = () => {
    setfixed(false);
  };
  const fixedTable = (props) => {
    setfixed(true);
    setfixedd(props);
    console.log(props);
  };

  //usestate
  const [matches, setmatches] = useState(false);
  const [matchesDetails, setfixedDetails] = useState([]);
  const matcheslistclose = () => {
    setmatches(false);
    setreload(!reload);
  };
  const matcheslist = (props) => {
    setmatches(true);
    axios
      .get(`/v1/requirementCollectionBS/Buyer/SameProduct/fixed/all/${props}`)
      .then((res) => {
        setreload(!reload);
        setfixedDetails(res.data);
        console.log(res.data);
      });

    //handle change for multiselect

    axios
      .get(`/v1/requirementCollectionBS/Buyer/${props}`)
      .then((res) => setBuyerData(res.data[0]));
  };
  //usestate
  let FixedData = [];
  const [isFixed, setIsFixed] = useState(false);
  const [FixedDataCollection, setfixedDataCollection] = useState([]);
  FixedDataCollection.map((item, index) =>
    item.fixStatus == "fixed" ? FixedData.push(item) : null
  );
  const IsFixedClose = () => {
    setIsFixed(false);
  };
  const Fixedlist = (props) => {
    setIsFixed(true);
    axios
      .get(`/v1/requirementCollectionBS/Buyer/SameProduct/fixed/all/${props}`)
      .then((res) => {
        setreload(!reload);
        setfixedDataCollection(res.data);
        console.log(res.data);
      });
    //handle change for multiselect
    axios
      .get(`/v1/requirementCollectionBS/Buyer/${props}`)
      .then((res) => setBuyerData(res.data[0]));
  };
  const UpdatedCallStatus = () => {
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
    if (values.callStatus == "accepted") {
      status = "fixed";
    }
    if (values.callStatus == "callback") {
      status = "pending";
    }
    if (values.callStatus == "rejected") {
      status = "rejected";
    }
    let totalPrice = values.buyerFixedQty * fixedd.moderatedPrice;
    const data = {
      fixStatus: status,
      buyerFixedQty: values.buyerFixedQty,
      totalPrice: totalPrice,
      fixDate: today,
      fixTime: time,
    };
    console.log(data);
    axios
      .put(`/v1/interestTable/${FixedId}`, data)
      .then((res) => {
        matcheslist(buyerId);
        console.log(res.data);
        setfixed(false);
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
  const RejectCallStatus = (props) => {
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

    // const data1 = {
    //   confirmCallStatus: "",
    //   confirmCallStatusDate: "",
    //   confirmCallStatusTime: "",
    // };
    // axios
    //   .put(`/v1/requirementCollectionBS/Buyer/${buyerId}`, data1)
    //   .then((res) => {
    //     setreload(!reload);
    //     IsCallStatusClose;
    //   });

    // const data = {
    //   fixStatus: "rejected",
    //   confirmCallStatus: "",
    //   fixDate: today,
    //   fixTime: time,
    // };
    console.log(props);
    axios
      .delete(`/v1/interestTable/${props}`)
      .then((res) => {
        console.log(res.data);
        fixedclose();
        matcheslist(buyerId);
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
    console.log(formik.values.timeCallback);
    //convert time string to number
    var a = formik.values.timeCallback;
    a = a.replace(/\:/g, "");
    const availableTime = parseInt(a);
    if (formik.values.callStatus === "rejected") {
      const data = {
        fixCallStatus: formik.values.callStatus,
      };
      axios
        .delete(`/v1/requirementCollectionBS/Buyer/${buyerId}`, data)
        .then((res) => {
          setreload(!reload);
          IsCallStatusClose;
        });
    }
    if (formik.values.callStatus === "accepted") {
      const data = {
        fixCallStatus: formik.values.callStatus,
      };
      axios
        .put(`/v1/requirementCollectionBS/Buyer/${buyerId}`, data)
        .then((res) => {
          setreload(!reload);
          IsCallStatusClose;
        });
    }
    if (formik.values.callStatus == "callback") {
      const data = {
        fixCallStatus: formik.values.callStatus,
        fixCallStatusDate: formik.values.dateCallback,
        fixCallStatusTime: availableTime,
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
        <title>Supplier/Buyer App - Fixed Order</title>
        <meta name="description" content="Generated by create next app" />
      </Head>
      <div className="p-4 ">
        <div className="w-full pb-4">
          <Breadcrumb separator=">">
            <Breadcrumb.Item href="/home">Home</Breadcrumb.Item>
            <Breadcrumb.Item>Fixed Order</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr className="p-1"></hr>
        <div className="flex items-center pb-4">
          <span className="flex-auto text-sky-500 text-xl">Fixed Order</span>
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
                  Date
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
                  no.of supplier found
                </Th>
                <Th textAlign="center" className="border">
                  count for confirmed suppliers
                </Th>
                <Th textAlign="center" className="border">
                  count for fixed
                </Th>
                <Th textAlign="center" className="border">
                  call status
                </Th>
                <Th textAlign="center" className="border">
                  call Action
                </Th>
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
                    <Td textAlign="center">{item.interest}</Td>
                    <Td textAlign="center">{item.shortlist}</Td>
                    <Td textAlign="center">
                      {item.fixed ? (
                        <Button
                          size="xs"
                          colorScheme="blue"
                          variant="link"
                          onClick={() => {
                            Fixedlist(item._id);
                            setBuyerId(item._id);
                            setreload(!reload);
                          }}
                        >
                          {item.fixed}
                        </Button>
                      ) : (
                        <div>0</div>
                      )}
                    </Td>
                    <Td>
                      {item.fixCallStatus ? (
                        <div>{item.fixCallStatus}</div>
                      ) : (
                        <div>pending</div>
                      )}
                    </Td>
                    <Td>
                      {item.fixCallStatus == "accepted" ? (
                        <Button size="xs" colorScheme="blue" disabled>
                          Fixed
                        </Button>
                      ) : (
                        <Button
                          size="xs"
                          colorScheme="blue"
                          onClick={() => {
                            matcheslist(item._id);
                            setBuyerId(item._id);
                            setreload(!reload);
                          }}
                        >
                          Fix
                        </Button>
                      )}
                      {/* <Button
                        size="xs"
                        colorScheme="blue"
                        onClick={() => {
                          matcheslist(item._id);
                          setBuyerId(item._id);
                          setreload(!reload);
                        }}
                      >
                        Fix
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
        <Modal size="5xl" isOpen={matches} onClose={matcheslistclose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Fixed Suppliers</ModalHeader>
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
                    <Button
                      size="sm"
                      colorScheme="blue"
                      onClick={() => IsCallStatus()}
                    >
                      call
                    </Button>
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
                      <Th textAlign="center">Quantity</Th>
                      <Th textAlign="center">Shortlisted qty</Th>
                      <Th textAlign="center">Moderate Price</Th>
                      <Th textAlign="center">total Price</Th>
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
                            {item.shortDate}
                            {" / "}
                            {<Time data={item.shortTime} />}
                          </Td>
                          <Td textAlign="center">{item.secretName}</Td>
                          <Td textAlign="center">{item.expectedQnty}</Td>
                          <Td textAlign="center">{item.shortlistQuantity}</Td>
                          <Td textAlign="center">{item.moderatedPrice}</Td>
                          <Td textAlign="center">
                            {item.shortlistQuantity * item.moderatedPrice}
                          </Td>
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
                            {item.fixStatus == "fixed" ? (
                              <div>{item.fixStatus}</div>
                            ) : (
                              <div>Pending</div>
                            )}
                          </Td>
                          <Td textAlign="center">
                            {item.fixStatus == "fixed" ? (
                              <Button
                                size="xs"
                                colorScheme="blue"
                                // onClick={() => {
                                //   fixedTable(item);
                                //   setFixedId(item.interestId);
                                // }}
                                disabled
                              >
                                {item.fixStatus}
                              </Button>
                            ) : (
                              <ButtonGroup spacing="1">
                                <Button
                                  size="xs"
                                  colorScheme="blue"
                                  onClick={() => {
                                    fixedTable(item);
                                    setFixedId(item.interestId);
                                  }}
                                >
                                  Fix
                                </Button>
                                <Button
                                  size="xs"
                                  colorScheme="red"
                                  onClick={() => {
                                    RejectCallStatus(
                                      item.supplierInterestTableId
                                    );
                                    //setFixedId(item.supplierInterestTableId);
                                  }}
                                >
                                  Rejected
                                </Button>
                              </ButtonGroup>
                            )}
                            {/* <Button
                              size="xs"
                              colorScheme="red"
                              onClick={() => {
                                RejectCallStatus(item.supplierInterestTableId);
                                //setFixedId(item.supplierInterestTableId);
                              }}
                            >
                              Rejected
                            </Button> */}
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
        <Modal size="5xl" isOpen={isFixed} onClose={IsFixedClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Fixed Suppliers</ModalHeader>
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
                      <Th textAlign="center">Quantity</Th>
                      <Th textAlign="center">Shortlisted qty</Th>
                      <Th textAlign="center">Moderate Price</Th>
                      <Th textAlign="center">total Price</Th>
                      <Th textAlign="center">Landing Price</Th>
                      <Th textAlign="center">Status</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {FixedData != "" ? null : (
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
                    {FixedData &&
                      FixedData.map((item, index) => (
                        <Tr colSpan="2" key={index}>
                          <Td textAlign="center">{index + 1}</Td>
                          <Td textAlign="center" className="w-32">
                            {item.shortDate}
                            {" / "}
                            {<Time data={item.shortTime} />}
                          </Td>
                          <Td textAlign="center">{item.secretName}</Td>
                          <Td textAlign="center">{item.expectedQnty}</Td>
                          <Td textAlign="center">{item.shortlistQuantity}</Td>
                          <Td textAlign="center">{item.moderatedPrice}</Td>
                          <Td textAlign="center">
                            {item.shortlistQuantity * item.moderatedPrice}
                          </Td>
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
                            {item.fixStatus == "fixed" ? (
                              <div>{item.fixStatus}</div>
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
              <Button onClick={IsFixedClose} colorScheme="blue" mr={3}>
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
        <Modal isOpen={fixed} onClose={fixedclose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Call Status</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Forms>
                <div className="grid items-center gap-2">
                  <div className="flex flex-row gap-2">
                    <label className="font-semibold ">
                      Shortlisted Qty Range :
                    </label>
                    {fixedd.shortlistQuantity}
                  </div>
                  <div className="flex flex-row gap-2">
                    <label className="font-semibold ">Moderated Price :</label>
                    {fixedd.moderatedPrice}
                  </div>
                  <div className="flex flex-row gap-2">
                    <label className="font-semibold ">Total Price :</label>
                    {fixedd.shortlistQuantity * fixedd.moderatedPrice}
                  </div>
                  <div className="grid pb-2 gap-2">
                    <label className="font-semibold ">
                      Buyer Fixed Quentity
                    </label>
                    <InputFields
                      type="string"
                      name="buyerFixedQty"
                      placeholder="Enter Fixed Quentity"
                      value={formik.values.buyerFixedQty || ""}
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
              <Button onClick={fixedclose} colorScheme="blue" mr={3}>
                Close
              </Button>
              <Button onClick={UpdatedCallStatus} colorScheme="blue" mr={3}>
                Save
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
export default FixedOrder;
