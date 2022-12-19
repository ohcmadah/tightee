import { useEffect, useState } from "react";

import * as tagManager from "../common/gtm";

const useGoogleTagManager = () => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!isInitialized) {
      tagManager.init();
      setIsInitialized(true);
    }
  }, []);
};

export default useGoogleTagManager;
