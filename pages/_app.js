import "../styles/globals.css";
import "../styles/App.css";
import { ChakraProvider } from "@chakra-ui/react";

import Layout from "./Layout/Layout";
function MyApp({ Component, pageProps: { ...pageProps } }) {
  return (
    <ChakraProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ChakraProvider>
  );
}

export default MyApp;
