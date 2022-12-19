import { useEffect } from "react";

import * as tagManager from "../common/gtm";

const useGoogleTagManager = () => {
  useEffect(() => {
    tagManager.init();
  }, []);
};

export default useGoogleTagManager;
