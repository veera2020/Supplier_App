/*
 *  Document    : Home.js
 *  Author      : Uyarchi
 *  Description : Home page of Admin
 */
import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import axios from "../../axios";
import { FaUsers } from "react-icons/fa";

const Home = () => {
  // useState
  const [userCount, setuserCount] = useState("");
  // Count
  useEffect(() => {
    axios
      .get("/v1/supplier/allData")
      .then((res) => {
        console.log(res.data);
        setuserCount(res.data.length);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);
  //dashboard
  const data = [
    {
      title: "USERS",
      count: userCount,
      icon: <FaUsers size={24} />,
      path: "/manageusers",
    },
  ];
  return (
    <>
      <Head>
        <title>Supplier Admin - Home</title>
        <meta name="description" content="Generated by create next app" />
      </Head>
      <div className="flex p-10">
        <div className="grid grid-cols-2 gap-10">
          {data &&
            data.map((item, index) => (
              <div
                key={index}
                className="col-span-1 pl-1 w-96 h-24 bg-green-400 rounded-lg shadow-md"
              >
                <div className="p-2 flex flex-col w-full h-full py-2 px-4 bg-white rounded-lg justify-between">
                  <div className="flex flex-row">
                    <div className="flex-auto">
                      <p className="font-bold pb-2">{item.title}</p>
                      <p className="text-lg">{item.count}</p>
                    </div>
                    <div className="my-auto">{item.icon}</div>
                  </div>
                  <div className="text-center font-semibold">
                    <Link href={item.path} className="font-semibold">
                      More Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};
export default Home;
