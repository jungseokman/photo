import GlobalStyles from "@/components/GlobalStyles";
import Theme from "@/components/Theme";
import wrapper from "@/store/store";
import Head from "next/head";
import PropTypes from "prop-types";
import { Provider } from "react-redux";
import { ThemeProvider } from "styled-components";

const MyApp = ({ Component, pageProps }) => {
  const { store, props } = wrapper.useWrappedStore(pageProps);

  return (
    <Provider store={store}>
      <ThemeProvider theme={Theme}>
        <GlobalStyles />
        <Head>
          <title>사진출력사이트</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Component {...props.pageProps} />
      </ThemeProvider>
    </Provider>
  );
};

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};

export default MyApp;
