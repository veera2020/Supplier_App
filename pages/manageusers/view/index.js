/*
 *  Document    : Home.js
 *  Author      : Uyarchi
 *  Description : View Single users
 */
import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Breadcrumb } from "antd";
import { Button } from "@chakra-ui/react";
//components
import EditUser from "../EditUser";
import axios from "../../../axios";
//function init
const Home = (props) => {
  //useState
  const [user, setuser] = useState("");
  const [reload, setreload] = useState(false);
  //router
  const router = useRouter();
  //useEffect
  useEffect(() => {
    axios
      .get(`/v1/supplierBuyer/${router.query.id}`)
      .then((res) => {
        setuser(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);
  //edit
  //usestate
  const [iseditopen, setIseditopen] = useState(false);
  const [empID, setEmpID] = useState("");
  const iseditclose = () => {
    setIseditopen(false);
    setreload(!reload);
    axios
      .get(`/v1/supplierBuyer/${router.query.id}`)
      .then((res) => {
        setuser(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const editFunction = (props) => {
    setIseditopen(true);
    setEmpID(props);
  };
  return (
    <>
      <Head>
        <title>supplierBuyer - View Users</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="p-4 ">
        <div className="w-full pb-4">
          <Breadcrumb separator=">">
            <Breadcrumb.Item href="/home">Home</Breadcrumb.Item>
            <Breadcrumb.Item>View User</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <hr className="p-1"></hr>
        <div className="flex gap-2 items-center pb-4">
          <span className="flex-auto text-sky-500 text-xl">View User</span>
          <Button colorScheme="blue" onClick={() => router.back()}>
            Back
          </Button>
          <Button
            colorScheme="blue"
            onClick={() => editFunction(router.query.id)}
          >
            Edit
          </Button>
          <Button colorScheme="blue" onClick={() => window.location.reload()}>
            Refresh
          </Button>
        </div>
        <div className="border border-graycolor cursor-pointer">
          <div className="grid grid-cols-5 px-4 p-1">
            <div className="col-span-1 text-blue-500 text-semibold border-r border-graycolor p-1">
              Trade Name
            </div>
            <div className="col-span-4 p-1">{user.tradeName}</div>
          </div>
          <div className="grid grid-cols-5 px-4 border-t border-graycolor">
            <div className="col-span-1 text-blue-500 text-semibold border-r border-graycolor p-1">
              Company Type
            </div>
            <div className="col-span-4 p-1">{user.companytype}</div>
          </div>

          <div className="grid grid-cols-5 px-4 border-t border-graycolor">
            <div className="col-span-1 text-blue-500 text-semibold border-r border-graycolor p-1">
              Secondary Contact Name
            </div>
            {user.secondaryContactName === "" ? (
              <div className="col-span-4 p-1">null</div>
            ) : (
              <div className="col-span-4 p-1">{user.secondaryContactName}</div>
            )}
          </div>
          <div className="grid grid-cols-5 px-4 border-t border-graycolor">
            <div className="col-span-1 text-blue-500 text-semibold border-r border-graycolor p-1">
              Secondary Contact No
            </div>
            {user.secondaryContactNumber === "" ? (
              <div className="col-span-4 p-1">null</div>
            ) : (
              <div className="col-span-4 p-1">
                {user.secondaryContactNumber}
              </div>
            )}
          </div>
          <div className="grid grid-cols-5 px-4 border-t border-graycolor">
            <div className="col-span-1 text-blue-500 text-semibold border-r border-graycolor p-1">
              Email
            </div>
            <div className="col-span-4 p-1">{user.email}</div>
          </div>
          <div className="grid grid-cols-5 px-4 border-t border-graycolor">
            <div className="col-span-1 text-blue-500 text-semibold border-r border-graycolor p-1">
              GST No
            </div>
            <div className="col-span-4 p-1">{user.gstNo}</div>
          </div>
          <div className="grid grid-cols-5 px-4 border-t border-graycolor">
            <div className="col-span-1 text-blue-500 text-semibold border-r border-graycolor p-1">
              Address
            </div>
            <div className="col-span-4 p-1">{user.RegisteredAddress}</div>
          </div>
          <div className="grid grid-cols-5 px-4 border-t border-graycolor">
            <div className="col-span-1 text-blue-500 text-semibold border-r border-graycolor p-1">
              Country
            </div>
            <div className="col-span-4 p-1">{user.countries}</div>
          </div>
          <div className="grid grid-cols-5 px-4 border-t border-graycolor">
            <div className="col-span-1 text-blue-500 text-semibold border-r border-graycolor p-1">
              State
            </div>
            <div className="col-span-4 p-1">{user.state}</div>
          </div>
          <div className="grid grid-cols-5 px-4 border-t border-graycolor">
            <div className="col-span-1 text-blue-500 text-semibold border-r border-graycolor p-1">
              District
            </div>
            <div className="col-span-4 p-1">{user.district}</div>
          </div>
          <div className="grid grid-cols-5 px-4 border-t border-graycolor">
            <div className="col-span-1 text-blue-500 text-semibold border-r border-graycolor p-1">
              Pincode
            </div>
            <div className="col-span-4 p-1">{user.pinCode}</div>
          </div>
          <div className="grid grid-cols-5 px-4 border-t border-graycolor">
            <div className="col-span-1 text-blue-500 text-semibold border-r border-graycolor p-1">
              Location
            </div>
            <div className="col-span-4 p-1">{user.gpsLocat}</div>
          </div>
          <div className="grid grid-cols-5 px-4 border-t border-graycolor">
            <div className="col-span-1 text-blue-500 text-semibold border-r border-graycolor p-1">
              Products Dealing With
            </div>
            <div className="col-span-4 p-1">{user.productDealingWith}</div>
          </div>
        </div>
      </div>
      {iseditopen && (
        <EditUser
          iseditopen={iseditopen}
          iseditclose={iseditclose}
          empID={empID}
        />
      )}
    </>
  );
};
export default Home;
