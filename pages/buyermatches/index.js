/*
 *  Document    : BuyerMatches.js
 *  Author      : uyarchi
 *  Description : Buyer Matches from Search
 */
import { useState, useEffect, useRef } from "react";
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
import Pagination from "../controls/Pagination";
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
const BuyerMatches = () => {
  //router
  const router = useRouter();
  // UseState
  const [reload, setreload] = useState("");
  const [Product, setProduct] = useState("null");
  const [FromPrice, setFromPrice] = useState("null");
  const [ToPrice, setToPrice] = useState("null");
  const [FromQty, setFromQty] = useState("null");
  const [ToQty, setToQty] = useState("null");
  // const [error, setPError] = useState("");
  const [buyer, setBuyer] = useState("");
  const [Destination, setDestination] = useState("null");
  const [total, setTotal] = useState("");

  console.log(ToPrice);

  useEffect(() => {
    axios
      .get("/v1/requirementCollection/buyer/productAll")
      .then((res) => {
        setBuyer(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  console.log(buyer);

  //table
  const EmployeeTable = useTable();
  //get employees
  const [id, setId] = useState("");
  const fetchdata = async (page = 1) => {
    EmployeeTable.setLoading(true);
    const response = await axios.get(
      `/v1/requirementCollection/supplier/productName/${Product}/${FromPrice}/${ToPrice}/${FromQty}/${ToQty}/${Destination}/${
        page - 1
      }`
    );
    if (response.status === 200 && response.data) {
      EmployeeTable.setRowData(response.data);
    } else {
      EmployeeTable.setRowData([]);
    }
  };

  // Search Method
  const handlesearch = () => {
    EmployeeTable.setCurrentPage(1);
    fetchdata(EmployeeTable.currentPage, EmployeeTable.showLimit);
  };

  // //useEffect
  // useEffect(() => {
  //   fetchdata(EmployeeTable.currentPage, EmployeeTable.showLimit);
  // }, [reload, EmployeeTable.currentPage, EmployeeTable.showLimit]);

  // Formik initilization
  const initialvalue = {
    product: "",
    fromPrice: "",
    toPrice: "",
    fromQty: "",
    toQty: "",
    destination: "",
  };
  // Formik Validation
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialvalue,
    validationSchema: Yup.object().shape({
      product: Yup.string().required("Select Product"),
      fromPrice: Yup.number().required("Select Starting Price"),
      toPrice: Yup.number().required("Select Ending Price"),
      fromQty: Yup.number(),
      toQty: Yup.number(),
      destination: Yup.string(),
    }),
  });
  // From Price
  let StartingPrice = [];
  for (let x = 10; x <= 500; x++) {
    StartingPrice.push(x);
    x += 9;
  }
  const StartingPriceLeval = StartingPrice.map((x) => {
    return <option key={x}>{x}</option>;
  });
  // To Price
  let EndingPrice = [];
  for (let x = FromPrice; x <= FromPrice + 500; x++) {
    EndingPrice.push(x);
    x++;
  }
  const EndingPriceLeval = EndingPrice.map((x) => {
    return <option key={x}>{x}</option>;
  });
  // From Qty
  let StartingQty = [];
  for (let x = 10; x <= 500; x++) {
    StartingQty.push(x);
    x += 9;
  }
  const StartingQtyLeval = StartingQty.map((x) => {
    return <option key={x}>{x}</option>;
  });
  // To Qty
  let EndingQty = [];
  for (let x = FromQty; x <= FromQty + 500; x++) {
    EndingQty.push(x);
    x++;
  }
  const EndingQtyLeval = EndingQty.map((x) => {
    return <option key={x}>{x}</option>;
  });
  // Total Price
  const TotalPrice = (props) => {
    console.log(props);
    let src = props.data;
    let tp = 0;
    if (src.length != 0) {
      tp = src.editedPrice * src.expquantity * 5;
      if (tp != 0) {
        return (
          <>
            <Button
              size="sm"
              colorScheme="gray"
              variant="link"
              // onClick={() => isSRIOpen(SRphotos)}
            >
              {"Total Price"}-{tp}
            </Button>
          </>
        );
      } else {
        return "";
      }
    }
  };
  // Landing Price
  const LandingPrice = (props) => {
    console.log(props);
    let src = props.data;
    let lp = 0;
    if (src.length != 0) {
      lp = 5 * src.expquantity;
      if (lp != 0) {
        return (
          <>
            <Button
              size="sm"
              colorScheme="red"
              variant="link"
              // onClick={() => isSRIOpen(SRphotos)}
            >
              {"Loading Price"}-{lp}
            </Button>
          </>
        );
      } else {
        return "";
      }
    }
  };
  //usestate
  const [isinterested, setIsInterested] = useState(false);
  const [details, setDetails] = useState("");
  const isInterestedClose = () => {
    setIsInterested(false);
  };
  const Interested = (props) => {
    setIsInterested(true);
    // axios
    //   .get(`/v1/requirementCollection/${props}`)
    //   .then((res) => setDetails(res.data));
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
          {/* {error && (
            <div className="flex items-center gap-3 ml-5">
              <Alert status="error">
                <AlertIcon />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </div>
          )} */}
          <div className="flex items-center gap-3">
            <Button colorScheme="blue" onClick={() => router.reload()}>
              Refresh
            </Button>
          </div>
        </div>
        <hr className="p-1"></hr>
        <div className="flex items-center gap-3 pb-4">
          <div className="flex-auto font-semibold text-primary"></div>
          <div className="flex">
            <select
              placeholder="Select"
              style={{ outline: 0 }}
              className="border border-graycolor w-36 focus-outline-none bg-whitecolor experience p-1"
              onChange={(e) => {
                //EmployeeTable.setCurrentPage(1);
                formik.setFieldValue("product", e.target.value);
                e.target.classList.add("change_color");
                setProduct(e.target.value);
              }}
            >
              <option value="null">Product</option>
              {buyer &&
                buyer.map((item, index) => (
                  <option key={index} value={item}>
                    {item.buyerpname}
                  </option>
                ))}
            </select>
            <span className="text-secondary pb-2">*</span>
          </div>
          <div className="flex">
            <select
              placeholder="Select"
              style={{ outline: 0 }}
              className="border border-graycolor w-36 focus-outline-none bg-whitecolor experience p-1"
              onChange={(e) => {
                formik.setFieldValue("fromPrice", e.target.value);
                e.target.classList.add("change_color");
                setFromPrice(e.target.value);
              }}
            >
              <option value="null">From Price</option>
              {StartingPriceLeval}
            </select>
            <span className="text-secondary pb-2">*</span>
          </div>
          <div className="flex">
            <select
              placeholder="Select"
              style={{ outline: 0 }}
              className="border border-graycolor w-36 focus-outline-none bg-whitecolor experience p-1"
              onChange={(e) => {
                formik.setFieldValue("toPrice", e.target.value);
                e.target.classList.add("change_color");
                setToPrice(e.target.value);
              }}
            >
              <option value="null">To Price</option>
              {EndingPriceLeval}
            </select>
            <span className="text-secondary pb-2">*</span>
          </div>
          <div className="flex">
            <select
              placeholder="Select"
              style={{ outline: 0 }}
              className="border border-graycolor w-36 focus-outline-none bg-whitecolor experience p-1"
              onChange={(e) => {
                formik.setFieldValue("fromQty", e.target.value);
                e.target.classList.add("change_color");
                setFromQty(e.target.value);
              }}
            >
              <option value="null">From Quentity </option>
              {StartingQtyLeval}
            </select>
          </div>
          <div className="flex">
            <select
              onChange={(e) => {
                formik.setFieldValue("toQty", e.target.value);
                e.target.classList.add("change_color");
                setToQty(e.target.value);
              }}
              style={{ outline: 0 }}
              className="border border-graycolor w-36 focus-outline-none bg-whitecolor experience p-1"
              required
            >
              <option value="null">To Quentity </option>
              {EndingQtyLeval}
            </select>
          </div>
          <div className="flex">
            <select
              onChange={(e) => {
                formik.setFieldValue("destination", e.target.value);
                e.target.classList.add("change_color");
                setDestination(e.target.value);
              }}
              style={{ outline: 0 }}
              className="border border-graycolor w-36 focus-outline-none bg-whitecolor experience p-1"
              required
            >
              <option value="null">Destination</option>
              {buyer &&
                buyer.map((item, index) => (
                  <option key={index} value={item}>
                    {item.deliverylocation}
                  </option>
                ))}
            </select>
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
                  Supplier Id
                </Th>
                {/* <Th rowSpan={2} textAlign="center" className="border">
                  Price
                  <Th textAlign="center">From</Th>
                  <Th textAlign="center">To</Th>
                </Th> */}
                <Th textAlign="center" className="border">
                  Available Quantity
                </Th>
                <Th textAlign="center" className="border">
                  Price/Kg
                </Th>
                <Th textAlign="center" className="border">
                  Source
                </Th>
                <Th textAlign="center" className="border">
                  Landing Price
                </Th>
                <Th textAlign="center" className="border">
                  Status
                </Th>
                <Th textAlign="center" className="border">
                  Action
                </Th>
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
                    <Td textAlign="center">
                      {index +
                        10 * (parseInt(EmployeeTable.currentPage) - 1) +
                        1}
                    </Td>
                    <Td textAlign="center">{item.secretName}</Td>
                    {/* <Td className="flex">
                  <Td textAlign="center">F-10</Td>
                  <Td textAlign="expprice">F-10</Td>
                </Td> */}
                    <Td textAlign="center">{item.expquantity}</Td>
                    <Td textAlign="center">{item.editedPrice}</Td>
                    <Td textAlign="center">{item.stocklocation}</Td>
                    <Td textAlign="center">
                      <TotalPrice data={item} />
                      <br></br>
                      <LandingPrice data={item} />
                    </Td>
                    <Td textAlign="center">Status</Td>
                    <Td textAlign="center">
                      <Button
                        size="xs"
                        colorScheme="blue"
                        onClick={() => Interested()}
                      >
                        Interested
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
        <Modal isOpen={isinterested} onClose={isInterestedClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader></ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <div className="flex justify-center text-center">
                <div className="object-cover h-48 w-96">
                  <h1>HELLO</h1>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button onClick={isInterestedClose} colorScheme="blue" mr={3}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </>
  );
};
export default BuyerMatches;
