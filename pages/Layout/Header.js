/*
 *  Document    : Layout.js
 *  Author      : Uyarchi
 *  Description : Layout for Admin
 */
import { useRouter } from "next/router";
import {
  Avatar,
  WrapItem,
  Menu,
  MenuList,
  MenuButton,
  MenuItem,
} from "@chakra-ui/react";
import Navbar from "./Navbar";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Header() {
  const router = useRouter();
  const { data: session } = useSession();
  if (session) {
    return (
      <>
        Signed in as {session.user.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }
  return (
    <header className="bg-sky-400 sticky top-0 z-10 h-14 flex items-center font-semibold uppercase px-8 ">
      <span className="flex-auto">Admin Panel</span>
      <div className="flex gap-2 items-center">
        <WrapItem>
          <Avatar name="Dan Abrahmov" src="https://bit.ly/dan-abramov" />
        </WrapItem>
        <Menu>
          <MenuButton>Welcome</MenuButton>
          <MenuList>
            <MenuItem>Forgot Password</MenuItem>
            {/* Not signed in <br /> */}
            <MenuItem onClick={() => signIn()}>Sign in</MenuItem>
            {/* <MenuItem onClick={() => router.push("/")}>Logout</MenuItem> */}
          </MenuList>
        </Menu>
      </div>
    </header>
  );
}
