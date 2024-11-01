"use client";

import AdminHeader from "@/app/_components/AdminHeader";
import RequestBreadcrumbs from "./RequestBreadcrumbs";
import StatusSelect from "./StatusSelect";
import RequestDetail from "./RequestDetail";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchingSelectedRequest,
  fetchingSelectedRequestFailure,
  fetchingSelectedRequestSuccess,
} from "@/app/_lib/features/requests/requestsSlice";
import useApiServices from "@/app/_hooks/useApiServices";
import { API_CONFIG } from "@/app/_utils/api.config";

function Page({ params: { yeuCauId } }) {
  const {
    selectedRequest,
    isFetchingSelectedRequest,
    isFetchingSelectedRequestError,
  } = useSelector((store) => store.requests);
  const dispatch = useDispatch();
  const { makeAuthorizedRequest } = useApiServices();

  const fetchSelectedRequest = React.useCallback(async () => {
    dispatch(fetchingSelectedRequest());

    const data = await makeAuthorizedRequest(
      API_CONFIG.BOOKINGS.GET_BY_ID(yeuCauId),
      "GET"
    );

    if (data.success) {
      dispatch(fetchingSelectedRequestSuccess(data.data));
    } else {
      dispatch(fetchingSelectedRequestFailure(data));
    }
  }, []);

  return (
    <div>
      <AdminHeader title={"Yêu cầu"} showSearchForm={false} />
      <RequestBreadcrumbs requestId={yeuCauId} />
      <RequestDetail />
    </div>
  );
}

export default Page;
