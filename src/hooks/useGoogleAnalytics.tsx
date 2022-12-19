import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import * as analytics from "../common/ga4";

const useGoogleAnalytics = () => {
  const location = useLocation();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!isInitialized) {
      analytics.init();
      setIsInitialized(true);
    }
  }, []);

  useEffect(() => {
    const path = location.pathname + location.search;
    analytics.sendPageview(path);
  }, [location]);
};

export default useGoogleAnalytics;
