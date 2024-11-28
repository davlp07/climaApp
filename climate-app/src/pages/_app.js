import Head from "next/head";
import Header from "../components/Header";
import '../styles/globals.css';

const MyApp = ({Component, pageProps}) => {
  return (
    <>
      <Head>
        <title>Será que chove?</title>
      </Head>
      <div>
      <Header/>
      <Component {...pageProps} />
      </div>
    </>
  )
}

export default MyApp;