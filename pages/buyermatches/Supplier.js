/*
 *  Document    : BuyerMatches.js
 *  Author      : uyarchi
 *  Description : Buyer Matches from Search
 */
import { useState, useEffect } from "react";
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
const Supplier = ({ isSupplieropen, isSupplierclose, SupplierDetails, setreload, reload }) => {
  //router
  const router = useRouter();
  // UseState
  const [Product, setProduct] = useState("null");
  const [FromPrice, setFromPrice] = useState("null");
  const [ToPrice, setToPrice] = useState("null");
  const [FromQty, setFromQty] = useState("null");
  const [ToQty, setToQty] = useState("null");
  
  const [Destination, setDestination] = useState("");
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

  //table
  const EmployeeTable = useTable();
  //get employees
  const fetchdata = async (page = 1) => {
    EmployeeTable.setLoading(true);
    const response = await axios.get(
      `/v1/requirementCollection/supplier/productName/${Product}/${FromPrice}/${ToPrice}/${FromQty}/${ToQty}/null/${
        page - 1
      }`
    );
    if (response.status === 200 && response.data) {
      EmployeeTable.setRowData(response.data.data);
    } else {
      EmployeeTable.setRowData([]);
    }
  };

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
      props.expquantity * props.editedPrice + props.expquantity * 5
    );
    //let a = props.expquantity * props.editedPrice + props.expquantity * 5
    console.log(Destination);
    console.log(props.stocklocation);
    setisvehicle(true);
    if (Destination != "") {
      const key = "AIzaSyDoYhbYhtl9HpilAZSy8F_JHmzvwVDoeHI";
      axios
        .get(
          `/v1/requirementCollection/thirdPartyApi/googleMap/${props.stocklocation}/${Destination}/${key}`
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
    }
  };
  const Interested = (props) => {
    const data = {
      matchesstatus: "Interested",
    };
    axios.put(`/v1/requirementCollection/${props}`, data).then((res) => {
      console.log(res.data);
      setreload(!reload);
    });
  };
  return (
    <>
      <Modal isOpen={isSupplieropen} size="xl" onClose={isSupplierclose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit User</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {errorMessage && (
              <div className="pb-5">
                <Alert status="error">
                  <AlertIcon />
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              </div>
            )}
            <Forms className="space-y-2">
              <Head>
                <title>Supplier/Buyer App - Buyer Matches</title>
                <meta
                  name="description"
                  content="Generated by create next app"
                />
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
                  <span className="flex-auto text-sky-500 text-xl">
                    Buyer Name
                  </span>
                  <div className="flex items-center gap-3">
                    <Button colorScheme="blue" onClick={() => router.reload()}>
                      Refresh
                    </Button>
                  </div>
                </div>
                <hr className="p-1"></hr>
                <div className="flex items-center gap-3 pb-4">
                  <div className="flex-auto font-semibold text-primary"></div>
                  <div className="flex">Buyer Product</div>
                  <div className="flex">Buyer Qty Range</div>
                  <div className="flex">Buyer Price Range</div>
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
                          Supplier name
                        </Th>
                        <Th textAlign="center" className="border">
                          Available Qty
                        </Th>
                        <Th textAlign="center" className="border">
                          Moderate price
                        </Th>
                        <Th textAlign="center" className="border">
                          landing price
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
                            <Td textAlign="center">{item.SecretName}</Td>
                            <Td textAlign="center">{item.expquantity}</Td>
                            <Td textAlign="center">{item.editedPrice}</Td>
                            <Td textAlign="center">{item.stocklocation}</Td>
                            <Td textAlign="center">
                              {item.matchesstatus === "" ? (
                                <Button
                                  size="xs"
                                  colorScheme="blue"
                                  onClick={() => Interested(item)}
                                >
                                  Interest
                                </Button>
                              ) : (
                                <Button
                                  disabled
                                  size="xs"
                                  colorScheme="blue"
                                  onClick={() => Interested()}
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
                <Modal isOpen={isvehicle} onClose={isvehicleclose} size="2xl">
                  <ModalOverlay />
                  <ModalContent>
                    <ModalHeader>Vehicle Chosen</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                      {distance != "" ? (
                        <div className="py-2 flex">
                          <div className="px-1 font-semibold">
                            Total Kilometers -
                          </div>
                          <div>{distancetonum}</div>
                        </div>
                      ) : null}
                      {distancetonum && (
                        <div className="border-gray-500 scroll-smooth border pb-5">
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
                      <Button
                        onClick={isvehicleclose}
                        colorScheme="blue"
                        mr={3}
                      >
                        Close
                      </Button>
                    </ModalFooter>
                  </ModalContent>
                </Modal>
              </div>
            </Forms>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={cancelbutton}>
              Cancel
            </Button>
            <Button onClick={formik.handleSubmit} colorScheme="blue">
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default Supplier;
