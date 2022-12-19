import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import * as pixel from "../common/metaPixel";
import { getCookieValue } from "../common/utils";

const useMetaPixcel = () => {
  if (!getCookieValue("_fbc")) {
    return;
  }

  const location = useLocation();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!isInitialized) {
      pixel.init();
      setIsInitialized(true);
    }
  }, []);

  useEffect(() => {
    pixel.pageView();
  }, [location]);
};

export default useMetaPixcel;
