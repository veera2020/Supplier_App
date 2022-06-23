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
    getItem("Option 2", "2"),
    getItem("Option 3", "3"),
    getItem("Option 4", "4"),
  ]),
  getItem("Navigation Two", "sub2", [
    getItem("Option 5", "5"),
    getItem("Option 6", "6"),
    getItem("Submenu", "sub3", null, [
      getItem("Option 7", "7"),
      getItem("Option 8", "8"),
    ]),
  ]),
  getItem("Navigation Three", "sub4", [
    getItem("Option 9", "9"),
    getItem("Option 10", "10"),
    getItem("Option 11", "11"),
    getItem("Option 12", "12"),
  ]),
]; // submenu keys of first level

const rootSubmenuKeys = ["sub1", "sub2", "sub4"];
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
        <Menu.Item key="3">
          <Link href="/manageorders">
            <a>Manage Orders</a>
          </Link>
        </Menu.Item>
        <Menu.Item key="4">
          <Link href="/managecustomers">
            <a>Manage Customers</a>
          </Link>
        </Menu.Item>
        <Menu.Item key="5">
          <Link href="/moderatecustomer">
            <a>Moderate Customers</a>
          </Link>
        </Menu.Item>
        <Menu.Item key="6">
          <Link href="/buyermatches">
            <a>Buyer Matches</a>
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
