/*
 *  Document    : Layout.js
 *  Author      : Uyarchi
 *  Description : Layout for Admin
 */
import { useRouter } from "next/router";
import Header from "./Header";
import Navbar from "./Navbar";
const Layout = ({ children }) => {
  const router = useRouter();
  return (
    <>
      <div className="">
        {router.pathname !== "/" ? (
          <>
            <Header />
            <main className="grid grid-cols-11">
              <div className="col-span-2">
                <Navbar path={router.route} />
              </div>
              <div className="col-span-9 flex-grow scrollbar-hide">{children}</div>
            </main>
          </>
        ) : (
          <main>
            <div className="flex-grow scrollbar-hide">{children}</div>
          </main>
        )}
      </div>
    </>
  );
};
export default Layout;
