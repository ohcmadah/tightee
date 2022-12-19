import metaPixcel from "react-facebook-pixel";

const META_PIXEL_ID = process.env.META_PIXEL_ID || "";

export const init = () => metaPixcel.init(META_PIXEL_ID);

export const pageView = () => metaPixcel.pageView();
