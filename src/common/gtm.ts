import gtm from "react-gtm-module";

const GTM_ID = process.env.GTM_ID || "";

export const init = () => gtm.initialize({ gtmId: GTM_ID });
