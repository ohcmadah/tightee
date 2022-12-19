import ga4 from "react-ga4";

const GA_MEASUREMENT_ID = process.env.GA_MEASUREMENT_ID || "";
const isProduction = process.env.NODE_ENV === "production";

export const init = () =>
  ga4.initialize(GA_MEASUREMENT_ID, {
    testMode: !isProduction,
  });

export const sendPageview = (path: string) =>
  ga4.send({
    hitType: "pageview",
    page: path,
  });
