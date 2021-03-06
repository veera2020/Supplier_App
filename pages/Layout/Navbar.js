/*
 *  Document    : Navbar.js
 *  Author      : Uyarchi
 *  Description : Navbar for Admin
 */
import { useState } from "react";
import { Menu } from "antd";
import Link from "next/link";
const { SubMenu } = Menu;
function getItem(label, key, children, type) {
  return {
    key,
    children,
    label,
    type,
  };
}

const items = [
  getItem("Navigation One", "sub1", [
    getItem("Option 1", "1"),
    getItem("Submenu", "sub2", null, [
      getItem("Option 2", "2"),
      getItem("Option 3", "3"),
    ]),
    getItem("Option 4", "4"),
  ]),
  getItem("Navigation Two", "sub3", [
    getItem("Option 5", "5"),
    getItem("Option 6", "6"),
    getItem("Submenu", "sub4", null, [
      getItem("Option 7", "7"),
      getItem("Option 8", "8"),
    ]),
  ]),
  getItem("Navigation Three", "sub5", [
    getItem("Option 9", "9"),
    getItem("Option 10", "10"),
    getItem("Option 11", "11"),
    getItem("Option 12", "12"),
  ]),
  getItem("Navigation Four", "sub6", [
    getItem("Option 13", "13"),
    getItem("Submenu", "sub7", null, [
      getItem("Option 14", "14"),
      getItem("Option 15", "15"),
    ]),
    getItem("Option 16", "16"),
    getItem("Option 17", "17"),
    getItem("Option 18", "18"),
  ]),
]; // submenu keys of first level

const rootSubmenuKeys = ["sub1", "sub2", "sub4", "sub5", "sub6"];
export default function Navbar({ defaultOpenKeys }) {
  // const onOpenChange = (props) => {
  //   const latestOpenKey = props.find((key) => openKeys.indexOf(key) === -1);
  //   if (rootKeys.indexOf(latestOpenKey) === -1) {
  //     setOpenKeys(props);
  //   } else {
  //     setOpenKeys(latestOpenKey ? [latestOpenKey] : defaultOpenKeys);
  //   }
  // };
  const [openKeys, setOpenKeys] = useState(["sub1"]);

  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };
  return (
    <aside className="w-60 flex h-full fixed">
      {/* <Menu
      mode="inline"
      openKeys={openKeys}
      defaultSelectedKeys={openKeys}
      onOpenChange={onOpenChange}
      style={{
        width: 256,
      }}
   //   items={items}
    /> */}
      <Menu
        mode="inline"
        //openKeys={openKeys}
        defaultSelectedKeys={["1"]}
        //onOpenChange={onOpenChange}
        defaultOpenKeys={["1"]}
      >
        <Menu.Item key="1">
          <Link href="/home">
            <a>Home</a>
          </Link>
        </Menu.Item>
        <Menu.Item key="2">
          <Link href="/manageusers">
            <a>Manage Users</a>
          </Link>
        </Menu.Item>
        <SubMenu key="3" title="Manage Orders">
          <Menu.Item key="4">
            <Link href="/ManageOrdersSupplier">
              <a>Supplier</a>
            </Link>
          </Menu.Item>
          <Menu.Item key="5">
            <Link href="/ManageOrderBuyer">
              <a>Buyer</a>
            </Link>
          </Menu.Item>
        </SubMenu>
        <SubMenu key="6" title="Manage Customer">
          <Menu.Item key="7">
            <Link href="/ManageCustomerSupplier">
              <a>Supplier</a>
            </Link>
          </Menu.Item>
          <Menu.Item key="8">
            <Link href="/ManageCustomerBuyer">
              <a>Buyer</a>
            </Link>
          </Menu.Item>
        </SubMenu>
        {/* <Menu.Item key="9">
          <Link href="/managecustomers">
            <a>Manage Customers</a>
          </Link>
        </Menu.Item> */}
        <Menu.Item key="9">
          <Link href="/moderatecustomer">
            <a>Moderate Customers</a>
          </Link>
        </Menu.Item>
        <Menu.Item key="11">
          <Link href="/buyermatches">
            <a>Buyer Matches</a>
          </Link>
        </Menu.Item>
        <Menu.Item key="12">
          <Link href="/shortlistedOrder">
            <a>Shortlisted Order</a>
          </Link>
        </Menu.Item>
        <Menu.Item key="13">
          <Link href="/FixedOrder">
            <a>Fixed Order</a>
          </Link>
        </Menu.Item>
        <SubMenu key="14" title="Account Statement">
          <Menu.Item key="15">
            <Link href="/AccountExecutive">
              <a>Account Executive</a>
            </Link>
          </Menu.Item>
          <Menu.Item key="16">
            <Link href="/AccountHistory">
              <a>Account History</a>
            </Link>
          </Menu.Item>
        </SubMenu>
        <Menu.Item key="17">
          <Link href="/SupplierMatches">
            <a>Supplier Matches</a>
          </Link>
        </Menu.Item>
        <Menu.Item key="18">
          <Link href="/videostreaming">
            <a>Live Streaming</a>
          </Link>
        </Menu.Item>

        {/* <Menu.Item key="6">
          <Link href="/managesupplierBuyer">
            <a>Manage Supplier/Buyer</a>
          </Link>
        </Menu.Item> */}

        {/* <Menu.Item key="4">
          <Link href="/moderatesupplier">
            <a>Moderate Supplier</a>
          </Link>
        </Menu.Item>
        <Menu.Item key="5">
          <Link href="/managesupplier">
            <a>Manage Moderate Supplier</a>
          </Link>
        </Menu.Item>
        <Menu.Item key="6">
          <Link href="/managebuyer">
            <a>Manage Buyer</a>
          </Link>
        </Menu.Item> */}
      </Menu>
    </aside>
  );
}
