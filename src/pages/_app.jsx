import Head from "next/head";
import "../styles/variables.css";
import "../styles/base.css";
import "../styles/typography.css";
import "../styles/layout.css";

function App({ Component, pageProps }) {
  const meta = {
    title: "مهر سلیمان | سولی لرنو",
    description:
      "نسخه نمایشی مهر سلیمان برای ارائه تجربه آموزشی سولی لرنو؛ بدون API یا پرداخت واقعی.",
    themeColor: "#38BDF8",
  };

  return (
    <>
      <Head>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <meta name="theme-color" content={meta.themeColor} />
        <meta name="robots" content="index,follow" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="مهر سلیمان" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default App;
