/*
 *  Document    : index.js
 *  Author      : uyarchi
 *  Description : Account Executive
 */
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { Breadcrumb } from "antd";
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
//function init
const AmountExecutive = () => {
  //router
  const router = useRouter();
  // UseState
  const [reload, setreload] = useState(false);
  const [detail, setDetail] = useState("");
  const [productslist, setproductslist] = useState([]);
  const [distance, setdistance] = useState("");
  const [distancetonum, setdistancetonum] = useState("");
  const [totalprice, setTotalprice] = useState("");
  const [Details, setDetails] = useState("");
  const [isTotalPrice, setTotalPrice] = useState("");
  const [IsSupplierId, setSupplierId] = useState([]);
  useEffect(() => {
    axios
      .get("/v1/requirementCollection/thirdPartyApi/product")
      .then((res) => setproductslist(res.data));
  }, []);
  //Formik InitialValue
  const initialvalue = {
    callStatus: "",
    paymentMode: "",
    paymentType: "",
    amountToBePaid: "",
  };
  //formik validation
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialvalue,
    validationSchema: Yup.object().shape({
      callStatus: Yup.string(),
      paymentMode: Yup.string(),
      paymentType: Yup.string(),
      amountToBePaid: Yup.string(),
    }),
  });
  //table
  var data = 0;
  const EmployeeTable = useTable();
  //get employees
  const fetchdata = async (page = 1) => {
    EmployeeTable.setLoading(true);
    const response = await axios.get(
      "/v1/requirementCollectionBS/Buyer/Live/all"
    );
    if (response.status === 200 && response.data) {
      EmployeeTable.setRowData(response.data);
      //console.log(response.data);
    } else {
      EmployeeTable.setRowData([]);
    }
  };
  useEffect(() => {
    fetchdata(EmployeeTable.currentPage, EmployeeTable.showLimit);
  }, [reload]);

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
    axios
      .get(`/v1/requirementCollectionBS/Buyer/${props}`)
      .then((res) => setBuyerData(res.data[0]));
  };
  //usestate
  const [islastTimeUpdatedQtyRange, setLastTimeUpdatedQtyRange] =
    useState(false);
  const [UpdatedDetails, setUpdatedDetails] = useState([]);
  const isLastTimeUpdatedQtyRangeClose = () => {
    setLastTimeUpdatedQtyRange(false);
  };
  const UpdatedQtyRangeList = (props) => {
    setLastTimeUpdatedQtyRange(true);
    axios
      .get(
        `/v1/requirementCollectionBS/Buyer/sameProduct/fixed/only/all/${props}`
      )
      .then((res) => setUpdatedDetails(res.data));
  };
  //usestate
  const [fixed, setfixed] = useState(false);
  const [fixedd, setfixedd] = useState([]);
  const fixedclose = () => {
    setfixed(false);
    // setreload(!reload);
  };
  const fixedTable = () => {
    setfixed(true);
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
        // setreload(!reload);
        setmatchesDetails(res.data);
        console.log(res.data);
      });

    //handle change for multiselect

    axios
      .get(`/v1/requirementCollectionBS/Buyer/${props}`)
      .then((res) => setBuyerData(res.data[0]));
  };
  const saveinterest = (props) => {
    console.log(IsSupplierId, "hema");
    let supplierId = [];
    let TotalPrice = 0;
    if (IsSupplierId.length != 0) {
      IsSupplierId.forEach((element) => {
        if (element.totalPrice) {
          TotalPrice += element.totalPrice;
        }
        supplierId.push(element.supplierReqId);
        // console.log(element.supplierReqId)
        //  setSupplierId(element.supplierReqId);
      });
    }
    console.log(supplierId);
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
    let status;
    if (formik.values.amountToBePaid == isTotalPrice) {
      status = "fully paid";
    }
    if (formik.values.amountToBePaid != isTotalPrice) {
      status = "partially paid";
    }
    if (formik.values.callStatus == "callback") {
      // convert time string to number
      var a = formik.values.timeCallback;
      a = a.replace(/\:/g, "");
      const availableTime = parseInt(a);
      const data = {
        finalcallStatus: formik.values.callStatus,
        finalcallbackdate: formik.values.dateCallback,
        finalcallbacktime: availableTime,
        // totalPrice: TotalPrice,
        // paymentMode: formik.values.paymentMode,
        // paymentType: formik.values.paymentType,
        // amountPaid: formik.values.amountToBePaid,
        // supplierId: supplierId,
        // buyerId: BuyerData._id,
        date: today,
        time: time,
        // status: status,
      };
      console.log(data);
      // axios.post(`/v1/paymentData/${BuyerData._id}`, data).then((res) => {
      //   console.log(res);
      // });
    }
    if (formik.values.callStatus == "accepted") {
      const data = {
        finalcallStatus: formik.values.callStatus,
        // finalcallbackdate: formik.values.dateCallback,
        // finalcallbacktime: availableTime,
        totalPrice: TotalPrice,
        paymentMode: formik.values.paymentMode,
        paymentType: formik.values.paymentType,
        amountPaid: formik.values.amountToBePaid,
        supplierId: supplierId,
        buyerId: BuyerData._id,
        date: today,
        time: time,
        status: "confirmed",
        payStatus: status,
      };
      console.log(data);
      // axios.post(`/v1/paymentData/${BuyerData._id}`, data).then((res) => {
      //   console.log(res);
      // });
    }
  };
  // Total Price Count
  const TotalPriceCount = (props) => {
    let tpc = props.data.totalPrice;
    setSupplierId(props.data.totalPrice);
    let supplierId = [];
    let TotalPrice = 0;
    if (tpc.length != 0) {
      tpc.forEach((element) => {
        // console.log(element,"hema")
        if (element.totalPrice) {
          TotalPrice += element.totalPrice;
        }
      });
      setTotalPrice(TotalPrice);
      //   setSupplierId(supplierId);
      if (TotalPrice != 0) {
        return <>{TotalPrice}</>;
      } else {
        return <>nill</>;
      }
    } else {
      return "";
    }
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
        <title>Supplier/Buyer App - Account Executive</title>
        <meta name="description" content="Generated by create next app" />
      </Head>
      <div className="p-4 ">
        <div className="w-full pb-4">
          <Breadcrumb separator=">">
            <Breadcrumb.Item href="/home">Home</Breadcrumb.Item>
            <Breadcrumb.Item>Account Executive</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr className="p-1"></hr>
        <div className="flex items-center pb-4">
          <span className="flex-auto text-sky-500 text-xl">
            Account Executive
          </span>
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
                  Date / time
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
                  count for Fixed suppliers
                </Th>
                <Th textAlign="center" className="border">
                  total amount
                </Th>
                <Th textAlign="center" className="border">
                  call status
                </Th>
                <Th textAlign="center" className="border">
                  status
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
                    colSpan="8"
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
                    <Td textAlign="center">
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
                        {item.fixed}
                      </Button>
                    </Td>
                    <Td textAlign="center">
                      <TotalPriceCount data={item} />
                    </Td>
                    <Td textAlign="center">{item.shortlist}</Td>
                    <Td textAlign="center">
                      {item.fixed >= 1 ? (
                        <div>Matched</div>
                      ) : (
                        <div>Pending</div>
                      )}
                    </Td>
                    <Td textAlign="center">
                      <Button
                        size="xs"
                        colorScheme="blue"
                        onClick={() => {
                          matcheslist(item._id);
                          setDetail(item);
                          <TotalPriceCount data={item} />;
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
          size="2xl"
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader></ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <div className="border-gray-500 scroll-smooth border mt-2">
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
                      <Th textAlign="center">Supplier Name</Th>
                      <Th textAlign="center">Available Qty</Th>
                      <Th textAlign="center">Shortlisted Qty</Th>
                      <Th textAlign="center">Moderated Price</Th>
                      <Th textAlign="center">Total Price</Th>
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
                    {UpdatedDetails &&
                      UpdatedDetails.map((item, index) => (
                        <Tr colSpan="2" key={index}>
                          <Td textAlign="center">{index + 1}</Td>
                          <Td textAlign="center">{item.secretName}</Td>
                          <Td textAlign="center">{item.expectedQnty}</Td>
                          <Td textAlign="center">{item.shortlistQuantity}</Td>
                          <Td textAlign="center">{item.moderatedPrice}</Td>
                          <Td textAlign="center">{item.totalPrice}</Td>
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
        <Modal size="4xl" isOpen={matches} onClose={matcheslistclose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader></ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <div className="grid items-center gap-2">
                <div className="grid pb-2 gap-2">
                  <label className="font-semibold ">Call Status</label>
                  <select
                    name="callStatus"
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
                {formik.values.callStatus == "callback" ? (
                  <>
                    <div className="grid pb-2 gap-2">
                      <InputFields
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
                      <InputFields
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
                {formik.values.callStatus == "accepted" ? (
                  <>
                    <div className="grid pb-2 gap-2">
                      <label className="font-semibold ">Total Amount : </label>
                      <input
                        type="string"
                        name="totalPrice"
                        placeholder={isTotalPrice}
                        value={formik.values.totalPrice || ""}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="input-primary"
                        disabled
                      />
                    </div>
                    <div className="grid pb-2 gap-2">
                      <label className="font-semibold ">Payment Mode :</label>
                      <select
                        name="paymentMode"
                        onChange={(e) => {
                          formik.setFieldValue("paymentMode", e.target.value);
                          e.target.classList.add("change_color");
                          console.log(detail);
                        }}
                        onBlur={formik.handleBlur}
                        style={{ outline: 0 }}
                        className="input-primary"
                      >
                        <option value="null">Select Payment Mode</option>
                        <option value="credit">Credit</option>
                        <option value="advance">Advance</option>
                        <option value="cod">COD</option>
                      </select>
                    </div>
                    <div className="grid pb-2 gap-2">
                      <label className="font-semibold ">Payment Type :</label>
                      <select
                        name="paymentType"
                        onChange={(e) => {
                          formik.setFieldValue("paymentType", e.target.value);
                          e.target.classList.add("change_color");
                        }}
                        onBlur={formik.handleBlur}
                        style={{ outline: 0 }}
                        className="input-primary"
                      >
                        <option value="null">Select Payment Type</option>
                        <option value="upi">UPI</option>
                        <option value="netbanking">Net Banking</option>
                        <option value="wallet">Wallet</option>
                      </select>
                    </div>
                    <div className="grid pb-2 gap-2">
                      <label className="font-semibold ">
                        Amount To Be Paid
                      </label>
                      <InputFields
                        type="string"
                        name="amountToBePaid"
                        placeholder="Enter Amount"
                        value={formik.values.amountToBePaid || ""}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="input-primary"
                      />
                    </div>
                  </>
                ) : null}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button onClick={matcheslistclose} colorScheme="blue" mr={3}>
                Close
              </Button>
              <Button
                colorScheme="blue"
                onClick={() => {
                  saveinterest();
                }}
              >
                Pay
              </Button>
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
                    <label className="font-semibold ">Total Amount :</label>
                    {BuyerData.minrange}
                  </div>
                  <div className="flex flex-row gap-2">
                    <label className="font-semibold ">Payment Mode :</label>
                    {Details.expectedQnty}
                  </div>
                  <div className="flex flex-row gap-2">
                    <label className="font-semibold ">Pay To Be Amount :</label>
                    {Details.expectedQnty}
                  </div>
                  <div className="grid pb-2 gap-2">
                    <label className="font-semibold ">Pay to be Amount</label>
                    <InputFields
                      type="string"
                      name="shortlistedQty"
                      placeholder="Enter Shortlisted Quentity"
                      //   value={formik.values.shortlistedQty || ""}
                      //   onChange={formik.handleChange}
                      //   onBlur={formik.handleBlur}
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
              <Button
                //onClick={UpdatedSupplierCallStatus}
                colorScheme="blue"
                mr={3}
              >
                Save
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </>
  );
};
export default AmountExecutive;
