/*
 *  Document    : index.js
 *  Author      : uyarchi
 *  Description : Supplier Matches from Search
 */
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { Breadcrumb } from "antd";
//import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
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

//function init
const SupplierMatches = () => {
  //router
  const router = useRouter();
  // UseState

  const [reload, setreload] = useState(false);
  const [statusname, setstatusname] = useState([]);
  const [productslist, setproductslist] = useState([]);
  const [distance, setdistance] = useState("");
  const [distancetonum, setdistancetonum] = useState("");
  const [totalprice, setTotalprice] = useState([]);
  const [Details, setDetails] = useState("");
  useEffect(() => {
    axios
      .get("/v1/requirementCollection/thirdPartyApi/product")
      .then((res) => setproductslist(res.data));
  }, []);
  //table
  const EmployeeTable = useTable();
  //get employees
  const fetchdata = async (page = 1) => {
    EmployeeTable.setLoading(true);
    const response = await axios.get("/v1/requirementCollectionBS/Supplier");
    if (response.status === 200 && response.data) {
      // EmployeeTable.setRowData(response.data);
      console.log(response.data);
      data(response.data);
    } else {
      EmployeeTable.setRowData([]);
    }
  };
  useEffect(() => {
    fetchdata(EmployeeTable.currentPage, EmployeeTable.showLimit);
  }, []);
  // filtering data to moderate price
  const data = (props) => {
    let datas = [];
    let rowData = props;
    rowData.map((item) =>
      item.moderatedPrice != null ? datas.push(item) : null
    );
    setTotalprice(datas);
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
  const [isSupplierDetails, setSupplierDetails] = useState(false);
  const [SupplierData, setSupplierData] = useState("");
  const isSupplierDetailsClose = () => {
    setSupplierDetails(false);
  };
  const Supplier = (props) => {
    setSupplierDetails(true);
    axios
      .get(`/v1/requirementCollectionBS/Supplier/${props}`)
      .then((res) => setSupplierData(res.data[0]));
  };
  //usestate
  const [islastTimeUpdatedQtyRange, setLastTimeUpdatedQtyRange] =
    useState(false);
  const [UpdatedDetails, setUpdatedDetails] = useState([]);
  let UpdateQty = [];
  let UpdatePrice = [];
  let UpdateLocation = [];
  UpdatedDetails.map((item) => (item.updatedQty ? UpdateQty.push(item) : null));
  UpdatedDetails.map((item) => (item.price ? UpdatePrice.push(item) : null));
  UpdatedDetails.map((item) =>
    item.stockLocation ? UpdateLocation.push(item) : null
  );
  const isLastTimeUpdatedQtyRangeClose = () => {
    setLastTimeUpdatedQtyRange(false);
  };
  const UpdatedQtyRangeList = (props) => {
    setLastTimeUpdatedQtyRange(true);
    axios
      .get(`/v1/requirementCollectionBS/Supplier/UpdataData/${props}`)
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
      .get(`/v1/requirementCollectionBS/Supplier/UpdataData/${props}`)
      .then((res) => setUpdatedDetails(res.data));
  };
  //usestate
  const [isIntrestedBuyerOpen, setIsIntrestedBuyerOpen] = useState(false);
  const [BuyerDetails, setBuyerDetails] = useState("");
  const isIntrestBuyerDataClose = () => {
    setIsIntrestedBuyerOpen(false);
  };
  const IntrestedBuyerData = (props) => {
    setIsIntrestedBuyerOpen(true);
    axios
      .get(`/v1/requirementCollectionBS/Supplier/interestData/${props}`)
      .then((res) => setBuyerDetails(res.data));
  };
  //usestate
  const [isModerate, setIsModerate] = useState(false);
  const [ModeratePrice, setModeratePrice] = useState("");
  const IsModerateClose = () => {
    setIsModerate(false);
  };
  const Moderate = (props) => {
    setIsModerate(true);
    axios
      .get(`/v1/requirementCollectionBS/Buyer/UpdataData/${props}`)
      .then((res) => setModeratePrice(res.data));
  };
  //usestate
  const [isBuyer, setIsBuyer] = useState(false);
  const [isBuyerMatches, setBuyerMatches] = useState("");
  const IsBuyerClose = () => {
    setIsBuyer(false);
  };
  const BuyerMatches = (props) => {
    setIsBuyer(true);
    axios
      .get(`/v1/requirementCollectionBS/Supplier/sameProduct/all/data/${props}`)
      .then((res) => setBuyerMatches(res.data));
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
        <title>Supplier/Buyer App - Supplier Matches</title>
        <meta name="description" content="Generated by create next app" />
      </Head>
      <div className="p-4 ">
        <div className="w-full pb-4">
          <Breadcrumb separator=">">
            <Breadcrumb.Item href="/home">Home</Breadcrumb.Item>
            <Breadcrumb.Item>Supplier Matches</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr className="p-1"></hr>
        <div className="flex items-center pb-4">
          <span className="flex-auto text-sky-500 text-xl">
            Supplier Matches
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
                  Requirement given Date
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
                  Quentity
                </Th>
                <Th textAlign="center" className="border">
                  price per kg
                </Th>
                <Th textAlign="center" className="border">
                  Moderated Price
                </Th>
                <Th textAlign="center" className="border">
                  Stock location
                </Th>
                <Th textAlign="center" className="border">
                  No.of Buyer found matches
                </Th>
                <Th textAlign="center" className="border">
                  No.of Buyer Intrested
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {totalprice != "" ? null : (
                <Tr>
                  <Td
                    style={{ textAlign: "center" }}
                    className="font-semibold"
                    colSpan="12"
                  >
                    No Data Found
                  </Td>
                </Tr>
              )}
              {totalprice &&
                totalprice.map((item, index) => (
                  <Tr key={index}>
                    <Td textAlign="center">
                      {index +
                        10 * (parseInt(EmployeeTable.currentPage) - 1) +
                        1}
                    </Td>
                    <Td textAlign="center">{item.date}</Td>
                    <Td textAlign="center">{item.requirementAddBy}</Td>
                    <Td textAlign="center">{item.secretName}</Td>
                    <Td textAlign="center" className="font-bold">
                      {item.name}
                      {/* <Button
                        size="md"
                        colorScheme="blue"
                        variant="link"
                        onClick={() => Supplier(item._id)}
                      >
                        {item.name}
                      </Button> */}
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
                        {item.expectedQnty}
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
                        {item.expectedPrice}
                      </Button>
                    </Td>
                    <Td textAlign="center">
                      <Button
                        size="sm"
                        colorScheme="blue"
                        variant="link"
                        onClick={() => Moderate(item)}
                      >
                        {item.moderatedPrice}
                      </Button>
                    </Td>
                    <Td textAlign="center">
                      {item.stockLocation}
                      {/* <Button
                        size="md"
                        colorScheme="blue"
                        variant="link"
                        // onClick={() => {
                        //   UpdatedLocationList(item._id);
                        //   // isOpenmap(item);
                        // }}
                      >
                        {item.stockLocation}
                      </Button> */}
                    </Td>
                    <Td textAlign="center">
                      <Button
                        size="md"
                        colorScheme="blue"
                        variant="link"
                        onClick={() => {
                          BuyerMatches(item._id);
                        }}
                      >
                        {item.sameProductCount}
                      </Button>
                    </Td>
                    <Td textAlign="center">
                      <Button
                        size="md"
                        colorScheme="blue"
                        variant="link"
                        onClick={() => {
                          IntrestedBuyerData(item._id);
                        }}
                      >
                        {item.interestCount}
                      </Button>
                    </Td>
                  </Tr>
                ))}
            </Tbody>
          </Table>
        </div>
        <Modal
          isOpen={isSupplierDetails}
          onClose={isSupplierDetailsClose}
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
                      {SupplierData.product}
                    </div>
                    <div className="col-span-2 text-blue-500 text-semibold border-r border-b border-graycolor p-1">
                      Stock Location
                    </div>
                    <div className="col-span-4 border-b p-1">
                      {SupplierData.stockLocation}
                    </div>
                    <div className="col-span-2 text-blue-500 text-semibold border-r border-b border-graycolor p-1">
                      Stock position
                    </div>
                    <div className="col-span-4 border-b p-1">
                      {SupplierData.stockPosition}
                    </div>
                    {SupplierData.stockPosition == "ready" ? (
                      <>
                        <div className="col-span-2 text-blue-500 text-semibold border-r border-b border-graycolor p-1">
                          Pack Type
                        </div>
                        <div className="col-span-4 border-b p-1">
                          {SupplierData.packType}
                        </div>
                        <div className="col-span-2 text-blue-500 text-semibold border-r border-b border-graycolor p-1">
                          Excepted Quantity
                        </div>
                        <div className="col-span-4 border-b p-1">
                          {SupplierData.expectedQnty}
                        </div>
                        <div className="col-span-2 text-blue-500 text-semibold border-r border-b border-graycolor p-1">
                          Excepted Price
                        </div>
                        <div className="col-span-4 border-b p-1">
                          {SupplierData.expectedPrice}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="col-span-2 text-blue-500 text-semibold border-r border-b border-graycolor p-1">
                          Stock Availability Date
                        </div>
                        <div className="col-span-4 border-b p-1">
                          {SupplierData.stockAvailabilityDate}
                        </div>
                        <div className="col-span-2 text-blue-500 text-semibold border-r border-b border-graycolor p-1">
                          Stock Availability Time
                        </div>
                        <div className="col-span-4 border-b p-1">
                          {SupplierData.stockAvailabilityTime}
                        </div>
                      </>
                    )}
                    <div className="col-span-2 text-blue-500 text-semibold border-r border-b border-graycolor p-1">
                      Payment Mode
                    </div>
                    <div className="col-span-4 border-b p-1">
                      {SupplierData.paymentMode}
                    </div>
                    {SupplierData.paymentMode == "advance" ? (
                      <>
                        <div className="col-span-2 text-blue-500 text-semibold border-r border-graycolor p-1">
                          Advance
                        </div>
                        <div className="col-span-4 p-1">
                          {SupplierData.advance}
                        </div>
                      </>
                    ) : null}
                    {SupplierData.status ? (
                      <>
                        <div className="col-span-2 text-blue-500 text-semibold border-r border-b border-graycolor p-1">
                          Status
                        </div>
                        <div className="col-span-4 border-b p-1">
                          {SupplierData.status}
                        </div>
                        {SupplierData.status == "Accepted" ? (
                          <>
                            <div className="col-span-2 text-blue-500 text-semibold border-r border-b border-graycolor p-1">
                              Accepted Reason
                            </div>
                            <div className="col-span-4 border-b p-1">
                              {SupplierData.statusAccept}
                            </div>
                            <div className="col-span-2 text-blue-500 text-semibold border-r border-b border-graycolor p-1">
                              FeedBack
                            </div>
                            <div className="col-span-4 border-b p-1">
                              {SupplierData.statusAccept == "Requirement Alive"
                                ? SupplierData.aliveFeedback == ""
                                  ? "null"
                                  : SupplierData.aliveFeedback
                                : null}
                              {SupplierData.statusAccept == "Requirement dead"
                                ? SupplierData.deadFeedback == ""
                                  ? "null"
                                  : SupplierData.deadFeedback
                                : null}
                              {SupplierData.statusAccept ==
                              "Requirement Alive with modification"
                                ? SupplierData.modificationFeedback == ""
                                  ? "null"
                                  : SupplierData.modificationFeedback
                                : null}
                            </div>
                          </>
                        ) : null}
                        {SupplierData.status == "CallBack" ? (
                          <>
                            <div className="col-span-2 text-blue-500 text-semibold border-r border-b border-graycolor p-1">
                              Callback Reason
                            </div>
                            <div className="col-span-4 border-b p-1">
                              {SupplierData.reasonCallback}
                            </div>
                            {SupplierData.reasonCallback ==
                            "Answer to call later" ? (
                              <>
                                <div className="col-span-2 text-blue-500 text-semibold border-r border-b border-graycolor p-1">
                                  Back to Call
                                </div>
                                <div className="col-span-4 border-b p-1">
                                  {SupplierData.dateCallback.split("T")[0]}
                                </div>
                              </>
                            ) : null}
                            <div className="col-span-2 text-blue-500 text-semibold border-r border-b border-graycolor p-1">
                              FeedBack
                            </div>
                            <div className="col-span-4 border-b p-1">
                              {SupplierData.feedbackCallback == ""
                                ? "null"
                                : SupplierData.feedbackCallback}
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
              <Button onClick={isSupplierDetailsClose} colorScheme="red" mr={3}>
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
            <ModalHeader>Quentity</ModalHeader>
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
                          <Td textAlign="center">{item.date}</Td>
                          <Td textAlign="center">
                            <Time data={item.time} />
                          </Td>
                          <Td textAlign="center">{item.updatedQty}</Td>
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
            <ModalHeader> Price </ModalHeader>
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
                          <Td textAlign="center">{item.price}</Td>
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
          size="5xl"
          isOpen={isIntrestedBuyerOpen}
          onClose={isIntrestBuyerDataClose}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader> Intrested Buyer Details </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <div className="border-gray-500 scroll-smooth border overflow-y-scroll">
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
                      <Th textAlign="center">rerquirement raised date</Th>
                      <Th textAlign="center">registered by whom</Th>
                      <Th textAlign="center">Requirement id</Th>
                      <Th textAlign="center">name</Th>
                      <Th textAlign="center">product</Th>
                      <Th textAlign="center">Qty range</Th>
                      <Th textAlign="center">price range</Th>
                      <Th textAlign="center">Deliver to the location</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {BuyerDetails != "" ? null : (
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
                    {BuyerDetails &&
                      BuyerDetails.map((item, index) => (
                        <Tr colSpan="2" key={index}>
                          <Td textAlign="center">{index + 1}</Td>
                          <Td textAlign="center">{item.date}</Td>
                          <Td textAlign="center">{item.createdBy}</Td>
                          <Td textAlign="center">{item.secretName}</Td>
                          <Td textAlign="center">{item.name}</Td>
                          <Td textAlign="center">{item.product}</Td>
                          <Td textAlign="center" className="w-32">
                            {item.minrange}
                            {" - "}
                            {item.maxrange}
                          </Td>
                          <Td textAlign="center">
                            {item.minprice}
                            {" - "}
                            {item.maxprice}
                          </Td>
                          <Td textAlign="center">{item.deliverylocation}</Td>
                        </Tr>
                      ))}
                  </Tbody>
                </Table>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                onClick={isIntrestBuyerDataClose}
                colorScheme="blue"
                mr={3}
              >
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Modal isOpen={isModerate} onClose={IsModerateClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader> Moderate Price </ModalHeader>
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
                      <Th textAlign="center">Moderate Price</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {ModeratePrice != "" ? null : (
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
                    {ModeratePrice &&
                      ModeratePrice.map((item, index) => (
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
              <Button onClick={IsModerateClose} colorScheme="blue" mr={3}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Modal isOpen={isBuyer} onClose={IsBuyerClose} size="5xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader> Matched Buyer Details </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <div className="border-gray-500 scroll-smooth border overflow-y-scroll">
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
                      <Th textAlign="center">rerquirement raised date</Th>
                      <Th textAlign="center">registered by whom</Th>
                      <Th textAlign="center">Requirement id</Th>
                      <Th textAlign="center">name</Th>
                      <Th textAlign="center">product</Th>
                      <Th textAlign="center">Qty range</Th>
                      <Th textAlign="center">price range</Th>
                      <Th textAlign="center">Deliver to the location</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {isBuyerMatches != "" ? null : (
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
                    {isBuyerMatches &&
                      isBuyerMatches.map((item, index) => (
                        <Tr colSpan="2" key={index}>
                          <Td textAlign="center">{index + 1}</Td>
                          <Td textAlign="center">{item.date}</Td>
                          <Td textAlign="center">{item.createdBy}</Td>
                          <Td textAlign="center">{item.secretName}</Td>
                          <Td textAlign="center">{item.name}</Td>
                          <Td textAlign="center">{item.product}</Td>
                          <Td textAlign="center" className="w-32">
                            {item.minrange}
                            {" - "}
                            {item.maxrange}
                          </Td>
                          <Td textAlign="center">
                            {item.minprice}
                            {" - "}
                            {item.maxprice}
                          </Td>
                          <Td textAlign="center">{item.deliverylocation}</Td>
                        </Tr>
                      ))}
                  </Tbody>
                </Table>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button onClick={IsBuyerClose} colorScheme="blue" mr={3}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </>
  );
};
export default SupplierMatches;
