import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentBranch } from "../_lib/features/branch/branchSlice";
import { API_CONFIG } from "../_utils/api.config";

const useBranchAccess = (branchSlug) => {
  const [canAccess, setCanAccess] = React.useState(true);
  const [retryUrl, setRetryUrl] = React.useState(null);

  const { currentBranch } = useSelector((store) => store.branch);

  const dispatch = useDispatch();

  React.useEffect(() => {
    const storedBranch = JSON.parse(localStorage.getItem("currentBranch"));

    if (storedBranch) {
      dispatch(getCurrentBranch(storedBranch));
    }
  }, [dispatch]);

  React.useEffect(() => {
    if (currentBranch) {
      if (branchSlug === undefined) {
        setCanAccess(true);
        return;
      }
      if (branchSlug !== currentBranch.slug) {
        setCanAccess(false);

        // Get the current URL
        const currentUrl = window.location.href;

        if (currentBranch.slug === API_CONFIG.GENERAL_BRANCH) {
          // Remove the slug from the current URL
          const urlWithoutSlug = currentUrl.replace(/\/[^/]+$/, ""); // This regex removes the last segment of the URL
          setRetryUrl(urlWithoutSlug);
        } else {
          // Replace the branchSlug in the current URL with currentBranch.slug
          const newUrl = currentUrl.replace(branchSlug, currentBranch.slug);
          setRetryUrl(newUrl);
        }
      }
    }
  }, [branchSlug, currentBranch]);

  return { canAccess, retryUrl };
};

export default useBranchAccess;
