/*
 *  Document    : Users.js
 *  Author      : uyarchi
 *  Description : User details
 */
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { Breadcrumb } from "antd";
import {
  RadioGroup,
  Stack,
  Radio,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  ButtonGroup,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
//components
import Pagination from "../controls/Pagination";
import axios from "../../axios";
import AddUser from "./AddUser";
import EditUser from "./EditUser";
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
const Status = [
  { value: "Allocated", label: "Allocated" },
  { value: "UnAllocated", label: "UnAllocated" },
  { value: "Disabled", label: "Disabled" },
];
//function init
const Users = () => {
  //router
  const router = useRouter();
  //usestate
  const [userId, setUserId] = useState("null");
  const [district, setdistrict] = useState("");
  const [districtId, setDistrictId] = useState("null");
  const [zone, setzone] = useState("");
  const [zoneId, setZoneId] = useState("null");
  const [ward, setward] = useState("");
  const [wardId, setWardId] = useState("null");
  const [empID, setEmpID] = useState("");
  const [reload, setreload] = useState(false);
  const [totalEmp, settotalEmp] = useState("");
  const [pDistrict, setPDistrict] = useState("");
  const [pZone, setPZone] = useState("");
  const [pWard, setPWard] = useState("");
  const [pWardid, setPWardid] = useState("");
  const [user, setuser] = useState("");
  const [name, setname] = useState("");
  const [status, setStatus] = useState("");
  // useEffect(() => {
  //   axios
  //     .get("/v1/district")
  //     .then((res) => {
  //       setdistrict(res.data);
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //     });
  //   axios
  //     .get("/v1/manageUser/manageUserAllData/all")
  //     .then((res) => {
  //       setuser(res.data);
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //     });
  // }, []);
  //getzone
  function getzone(props) {
    axios
      .get(`/v1/zone/zoneByDistrict/${props.target.value}`)
      .then((resp) => {
        setzone(resp.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }
  //getward
  function getward(props) {
    axios
      .get(`/v1/ward/wardByZone/${props.target.value}`)
      .then((resp) => {
        setward(resp.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }
  //get prefered zone
  const getpzone = (props) => {
    axios
      .get(`/v1/manageUser/${userId}`)
      .then((res) => {
        setPDistrict(res.data[0].preferredDistrict);
        setPZone(res.data[0].preferredZone);
        setPWard(res.data[0].preferredWard);
        setPWardid(res.data[0].preferredWardId);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //table
  const EmployeeTable = useTable();
  //get employees
  const [id, setId] = useState("");
  const fetchdata = async (page = 1) => {
    EmployeeTable.setLoading(true);
    const response = await axios.get("/v1/supplierBuyer/allData");
    if (response.status === 200 && response.data) {
      EmployeeTable.setRowData(response.data);
      settotalEmp(response.data.count);
    } else {
      EmployeeTable.setRowData([]);
    }
  };
  //useEffect
  useEffect(() => {
    fetchdata(EmployeeTable.currentPage, EmployeeTable.showLimit);
  }, [reload, EmployeeTable.currentPage, EmployeeTable.showLimit]);

  //deleteHandler
  const [isdeleteOpen, setIsdeleteOpen] = useState(false);
  const ondeleteClose = () => {
    setIsdeleteOpen(false);
  };
  const cancelRef = useRef();
  const DeleteHandler = async () => {
    ondeleteClose();
    const isDeleted = await axios.delete(`/v1/supplierBuyer/${id}`);
    if (isDeleted) {
      EmployeeTable.setCurrentPage(1);
      setreload(!reload);
    }
  };
  //enablehandler
  const [isenableOpen, setIsenableOpen] = useState(false);
  const onenableClose = () => {
    setIsenableOpen(false);
  };
  const enableRef = useRef();
  const EnableHandler = async () => {
    onenableClose();
    const data = {
      active: true,
      archive: false,
    };
    const isDeleted = await axios.put(`/v1/supplierBuyer/${id}`,data);
    if (isDeleted) {
      EmployeeTable.setCurrentPage(1);
      setreload(!reload);
    }
  };
  //edit
  //usestate
  const [iseditopen, setIseditopen] = useState(false);
  const iseditclose = () => {
    setIseditopen(false);
  };
  const editFunction = (id) => {
    setIseditopen(true);
    setEmpID(id);
  };
  return (
    <>
      <Head>
        <title>Supplier - Manage Users</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="p-4 ">
        <div className="w-full pb-4">
          <Breadcrumb separator=">">
            <Breadcrumb.Item href="/home">Home</Breadcrumb.Item>
            <Breadcrumb.Item>Manage User</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr className="p-1"></hr>
        <div className="flex items-center pb-4">
          <span className="flex-auto text-sky-500 text-xl">Manage Users</span>
          <div className="flex items-center gap-3">
            <AddUser setreload={setreload} reload={reload} />
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
                <Th>Type</Th>
                <Th>Name</Th>
                <Th>Mobile No</Th>
                <Th>Actions</Th>
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
                    <Td>{item.type}</Td>
                    <Td>{item.primaryContactName}</Td>
                    <Td>{item.primaryContactNumber}</Td>
                    <Td>
                      {item.active === true ? (
                        <ButtonGroup
                          spacing="1"
                          onClick={() => setId(item._id)}
                        >
                          <Button
                            size="xs"
                            colorScheme="blue"
                            onClick={() => {
                              router.push(
                                {
                                  pathname: "/manageusers/view",
                                  query: { id: item._id },
                                },
                                "manageusers/view"
                              );
                            }}
                          >
                            View
                          </Button>
                          <Button
                            size="xs"
                            colorScheme="orange"
                            onClick={() => editFunction(item._id)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="xs"
                            colorScheme="red"
                            onClick={() => setIsdeleteOpen(true)}
                          >
                            Disable
                          </Button>
                        </ButtonGroup>
                      ) : (
                        <ButtonGroup
                          spacing="1"
                          onClick={() => setId(item._id)}
                        >
                          <Button
                            size="xs"
                            colorScheme="blue"
                            onClick={() => {
                              router.push(
                                {
                                  pathname: "/manageusers/view",
                                  query: { id: item._id },
                                },
                                "manageusers/view"
                              );
                            }}
                          >
                            View
                          </Button>
                          <Button
                            size="xs"
                            colorScheme="red"
                            onClick={() => setIsenableOpen(true)}
                          >
                            Enable
                          </Button>
                        </ButtonGroup>
                      )}
                    </Td>
                  </Tr>
                ))}
            </Tbody>
          </Table>
        </div>
        {/* <Pagination
          totalRecord={totalEmp ? totalEmp : 0}
          rowLength={EmployeeTable.rowData ? totalEmp : 0}
          {...EmployeeTable}
        /> */}
        {isdeleteOpen && (
          <AlertDialog
            isOpen={isdeleteOpen}
            leastDestructiveRef={cancelRef}
            onClose={ondeleteClose}
          >
            <AlertDialogOverlay>
              <AlertDialogContent>
                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                  Disable User
                </AlertDialogHeader>
                <AlertDialogBody>
                  Are you sure? You want to disable this user.
                </AlertDialogBody>
                <AlertDialogFooter>
                  <Button ref={cancelRef} onClick={ondeleteClose}>
                    Cancel
                  </Button>
                  <Button colorScheme="red" onClick={DeleteHandler} ml={3}>
                    Disable
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>
        )}
        {isenableOpen && (
          <AlertDialog
            isOpen={isenableOpen}
            leastDestructiveRef={enableRef}
            onClose={onenableClose}
          >
            <AlertDialogOverlay>
              <AlertDialogContent>
                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                  Enable User
                </AlertDialogHeader>
                <AlertDialogBody>
                  Are you sure? You want to enable this user.
                </AlertDialogBody>
                <AlertDialogFooter>
                  <Button ref={enableRef} onClick={onenableClose}>
                    Cancel
                  </Button>
                  <Button colorScheme="red" onClick={EnableHandler} ml={3}>
                    Enable
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>
        )}
        {iseditopen && (
          <EditUser
            iseditopen={iseditopen}
            iseditclose={iseditclose}
            empID={empID}
            setreload={setreload}
            reload={reload}
          />
        )}
      </div>
    </>
  );
};
export default Users;
