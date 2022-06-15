/*
 *  Document    : Buyer.js
 *  Author      : uyarchi
 *  Description : Manage Buyer
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
const Buyer = () => {
  //router
  const router = useRouter();
  //usestate
  const [reload, setreload] = useState(false);

  //table
  const EmployeeTable = useTable();
  //get employees
  const [id, setId] = useState("");
  const fetchdata = async (page = 1) => {
    EmployeeTable.setLoading(true);
    const response = await axios.get("/v1/supplierBuyer/type/getName/Buyer");
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

  //modal for order details
  //usestate
  const [isshopopen, setIsshopopen] = useState(false);
  const [shop, setshop] = useState("");
  const isshopclose = () => {
    setIsshopopen(false);
  };
  const isopenshop = (props) => {
    setIsshopopen(true);
    axios.get(`/v1/supplierBuyer/${props}`).then((res) => setshop(res.data));
  };
  return (
    <>
      <Head>
        <title>Supplier/Buyer App - Manage Buyer</title>
        <meta name="description" content="Generated by create next app" />
      </Head>
      <div className="p-4 ">
        <div className="w-full pb-4">
          <Breadcrumb separator=">">
            <Breadcrumb.Item href="/home">Home</Breadcrumb.Item>
            <Breadcrumb.Item>Manage Buyer</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr className="p-1"></hr>
        <div className="flex items-center pb-4">
          <span className="flex-auto text-sky-500 text-xl">
            Manage Buyer
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
        <div className="border-gray-500 scroll-smooth border">
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
                <Th>Product Name</Th>
                <Th>Name</Th>
                <Th>Mobile Number</Th>
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
                    <Td>{item.date}</Td>
                    <Td>{item.buyerpname}</Td>
                    <Td>
                      <Button
                        size="sm"
                        colorScheme="blue"
                        variant="link"
                        onClick={() => isopenshop(item._id)}
                      >
                        {item.primaryContactName}
                      </Button>
                    </Td>
                    <Td>{item.primaryContactNumber}</Td>
                  </Tr>
                ))}
            </Tbody>
          </Table>
        </div>
        <Modal
          //isOpen={isshopopen}
          onClose={isshopclose}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Shop Details</ModalHeader>
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
                    <div className="col-span-4 p-1">{shop.buyerpname}</div>
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
      </div>
    </>
  );
};
export default Buyer;
